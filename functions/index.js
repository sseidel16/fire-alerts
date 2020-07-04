const functions = require('firebase-functions');
const Twilio = require('twilio');
const admin = require('firebase-admin');

admin.initializeApp();

const AccessToken = Twilio.jwt.AccessToken;

const config = functions.config();

const accountSid = config.twilio.account.sid;
const serviceSid = config.twilio.service.sid;
const apiKey = config.twilio.api.key;
const apiSecret = config.twilio.api.secret;

// grab twilio JWT
exports.twilio_auth = functions.https.onCall((data, context) => {
    console.log('Creating JWT');

    const email = context.auth.token.email;
    console.log(email);

    const identity = email;
    console.log(data);

    const adminEmailRef = admin.firestore().collection('admins').doc(email);

    return adminEmailRef.get()
        .then(doc => {
            const adminExists = doc.exists;
            console.log(`Admin exists: ${adminExists}`);

            return adminExists;
        })
        .then(isAdmin => {
            if (isAdmin) {
                const syncGrant = new AccessToken.SyncGrant({ serviceSid });

                const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
                token.addGrant(syncGrant);

                // Serialize the token to a JWT string
                const jwt = token.toJwt();

                return { request: data, email, jwt };
            } else throw new Error(`${email} is not an admin`);
        });
});

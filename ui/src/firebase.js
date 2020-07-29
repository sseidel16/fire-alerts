import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyD5OjUZDi23hFt4rzOY_E6xnBcO2aGKIcI",
    authDomain: "firegroupadmins.firebaseapp.com",
    databaseURL: "https://firegroupadmins.firebaseio.com",
    projectId: "firegroupadmins",
    storageBucket: "firegroupadmins.appspot.com",
    messagingSenderId: "897984608469",
    appId: "1:897984608469:web:9fc738a2234f0ce734ca5c"
};

firebase.initializeApp(firebaseConfig);

// uncomment next line to call twilio_auth locally during testing
// firebase.functions().useFunctionsEmulator('http://localhost:5001');

/*
// mock firebase interactions
const firebase = {
    auth: () => ({
        onAuthStateChanged: setUser => setUser({
            email: 'admin@localhost:3000',
            photoURL: 'http://localhost:3000/favicon.ico'
        }),
        signOut: () => alert('Sign out unsupported in testing')
    }),
    functions: () => ({
        httpsCallable: name => request => {
            if (name === 'twilio_auth') return Promise.resolve({ data: { jwt: 'jwt_string' } });
            else return Promise.reject(new Error(`Function not found: ${name}`));
        }
    })
};
*/

export default firebase;
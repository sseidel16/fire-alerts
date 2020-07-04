import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from './firebase';
import Loading from './loading/Loading';
import Subscribers from './subscribers/Subscribers';

function App() {
    const [user, setUser] = useState(null);
    const [twilioJwt, setTwilioJwt] = useState(null);

    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading('Authenticating');
        firebase.auth().getRedirectResult().then(result => {
            // The signed-in user info.
            var user = result.user;

            if (user) {
                console.log(result);
                setUser(user);
                setLoading('Connecting to Twilio');
                const twilioAuth = firebase.functions().httpsCallable('twilio_auth');

                console.log('Calling Twilio Auth');
                return twilioAuth({ payload: 'Hello World' })
                    .then(response => setTwilioJwt(response?.data?.jwt), console.error);
            } else {
                setLoading('Redirecting');
                const provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithRedirect(provider);
            }
        }, error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            console.error(error);
        }).finally(() => setLoading(null));
    }, []);

    return (
        <div className='App'>
            {loading ? <Loading message={loading} /> : null}
            {twilioJwt ? <Subscribers twilioJwt={twilioJwt} /> : null}
        </div>
    );
}

export default App;

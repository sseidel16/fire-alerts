import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from './firebase';
import Loading from './loading/Loading';
import Subscribers from './subscribers/Subscribers';
import Header from './header/Header';

function App() {
    const [user, setUser] = useState(null);
    const [twilioJwt, setTwilioJwt] = useState(null);

    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (user) {
            setLoading('Connecting to Twilio');
            const twilioAuth = firebase.functions().httpsCallable('twilio_auth');

            console.log('Calling Twilio Auth');
            twilioAuth({ payload: 'Hello World' })
                .then(response => setTwilioJwt(response?.data?.jwt))
                .catch(console.error)
                .finally(() => setLoading(null));
        } else {
            setTwilioJwt(null);
        }
    }, [user]);

    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        setLoading('Authenticating');
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                // The signed-in user info.
                var user = result.user;
                console.log(user);
            })
            .catch(console.error)
            .finally(() => setLoading(null));
    };

    const signOut = () => {
        firebase.auth().signOut();
    };

    useEffect(() => {
        firebase.auth().onAuthStateChanged(setUser);
    }, []);

    return (
        <div className='App'>
            <Header {...{ user, signIn, signOut }} />
            {loading ? <Loading message={loading} /> : null}
            {twilioJwt ? <Subscribers twilioJwt={twilioJwt} /> : null}
        </div>
    );
}

export default App;

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

export default firebase;
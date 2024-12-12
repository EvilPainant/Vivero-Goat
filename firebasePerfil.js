import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyANERwSZvEoZh5M0m91GwmPw7llkZLksiI",
    authDomain: "vivelo-4c604.firebaseapp.com",
    projectId: "vivelo-4c604",
    storageBucket: "vivelo-4c604.firebasestorage.app",
    messagingSenderId: "419261307013",
    appId: "1:419261307013:web:59f5d082c4007e470df1ec",
    measurementId: "G-PE29ZG57HJ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

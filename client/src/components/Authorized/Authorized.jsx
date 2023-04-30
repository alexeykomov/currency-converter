import React, {ReactElement, useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
    EmailAuthProvider,
    getAuth,
    User,
    onAuthStateChanged
} from "firebase/auth";
import {auth as authUI} from "firebaseui";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNYVZ8nH5YxJSxMmsC05Bm8hjmVDWvR7s",
    authDomain: "currency-converter-8ab60.firebaseapp.com",
    projectId: "currency-converter-8ab60",
    storageBucket: "currency-converter-8ab60.appspot.com",
    messagingSenderId: "1064673614201",
    appId: "1:1064673614201:web:ccb5bbd087e665ef09f7a8",
    measurementId: "G-4G81QLCRFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Initialize the FirebaseUI Widget using Firebase.
const ui = new authUI.AuthUI(auth);

export const UserContext = React.createContext(null);

export const Authorized = ({children}) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(auth.currentUser)
            } else {
                showLogin().then(setUser).catch(setError);
                setUser(null)
            }
        });

        return () => {
            unsub();
        }
    }, [auth.currentUser])
    if (error) {
        return <div>{`Authorization error: ${error}`}</div>
    }
    if (user) {
        return <UserContext.Provider value={user}>{children}</UserContext.Provider>
    }
    return null;
}

const showLogin = () => new Promise((resolve, reject) => ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ],
    callbacks: {
        signInSuccessWithAuthResult(authResult, redirectUrl) {
            resolve(authResult.user)
            return false;
        },
        signInFailure(error) {
            console.error('error: ', error);
            reject(error);
        }
    }
}));

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDjhOg3jmEzS-2fOuHtNAnowzI05TYZSeA",
    authDomain: "sparkfund-7d356.firebaseapp.com",
    projectId: "sparkfund-7d356",
    storageBucket: "sparkfund-7d356.firebasestorage.app",
    messagingSenderId: "802077296116",
    appId: "1:802077296116:web:cc81782c086a0417d4e5a1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
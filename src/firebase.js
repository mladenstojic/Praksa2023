import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9f4x1Cp8o_roMJkgaSOSmWcxk6uEMME8",
  authDomain: "praksa2023-d4fe0.firebaseapp.com",
  projectId: "praksa2023-d4fe0",
  storageBucket: "praksa2023-d4fe0.appspot.com",
  messagingSenderId: "334923799795",
  appId: "1:334923799795:web:cb385dac24e8eb5abb6b86"
};

// Initialize Firebase
export const fire = initializeApp(firebaseConfig);
export const auth = getAuth(fire);
export const db = getFirestore(fire);

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}



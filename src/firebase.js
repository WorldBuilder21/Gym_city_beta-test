import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAjUqMWeW6463OXp8HWqefdj5r4AO4kZ4",
  authDomain: "gym-city-test.firebaseapp.com",
  projectId: "gym-city-test",
  storageBucket: "gym-city-test.appspot.com",
  messagingSenderId: "1065580307653",
  appId: "1:1065580307653:web:68b47f2601c39edb62bcac",
  measurementId: "G-NT1ZZ22R32",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);

//for production
// export const db = getFirestore(app);

// for test purposes
export const db = getFirestore();

export const storage = getStorage(app);

const analytics = getAnalytics(app);

connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);
connectStorageEmulator(storage, "localhost", 9199);

export default app;

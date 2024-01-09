// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKi21uChAt8qxF9zC4FL7BDAvYn9y2dBw",
  authDomain: "chat-739d2.firebaseapp.com",
  projectId: "chat-739d2",
  storageBucket: "chat-739d2.appspot.com",
  messagingSenderId: "536872919213",
  appId: "1:536872919213:web:5347261def9106f5db2624",
  measurementId: "G-W4Y1NE6HH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage};

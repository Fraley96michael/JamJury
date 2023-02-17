import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBr_SRm30W6kS5zjP3f0rokLmcfG_f4ZA8",
  authDomain: "jamjury-deb87.firebaseapp.com",
  projectId: "jamjury-deb87",
  storageBucket: "jamjury-deb87.appspot.com",
  messagingSenderId: "283054610835",
  appId: "1:283054610835:web:b429b7dbc2a3c3caa07066",
  measurementId: "G-SWPVLB7GHP",
};
// Initialize Firebase
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };

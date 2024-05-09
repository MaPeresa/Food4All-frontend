import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0pk3xKnnl8gzbkUJHzQo-C8k1y8sYzsM",
  authDomain: "food4all-418fe.firebaseapp.com",
  projectId: "food4all-418fe",
  storageBucket: "food4all-418fe.appspot.com",
  messagingSenderId: "628529731858",
  appId: "1:628529731858:web:64a45225e322198cd43bcb",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let storage = firebase.storage();

export { firebase, db, storage };

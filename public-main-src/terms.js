// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACWuZvxCavjRcuuldk0ZhHoq5S0rJ7MUY",
  authDomain: "pgccteetimes-2fdb6.firebaseapp.com",
  databaseURL: "https://pgccteetimes-2fdb6.firebaseio.com",
  projectId: "pgccteetimes-2fdb6",
  storageBucket: "pgccteetimes-2fdb6.appspot.com",
  messagingSenderId: "383036367934",
  appId: "1:383036367934:web:a7daed4de45c1d6b389d6f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
// var db = firebase.firestore();
//     db.collection("admin").doc("generalPageInfo").get().then((doc) => {
//         document.querySelector("body").innerHTML = doc.data().TandC;
//     });

const docRef = doc(db, "admin", "generalPageInfo");
getDoc(docRef).then((d) => {
  if (d.exists()) {
    document.querySelector("body").innerHTML = d.data().TandC;
    console.log("Document data:", d.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
});

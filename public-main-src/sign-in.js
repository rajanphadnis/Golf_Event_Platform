// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
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
const uri = window.location.search;
var queryString;
try {
  queryString = decodeURI(uri);
} catch (e) {
  // catches a malformed URI
  console.error(e);
  queryString = uri;
}
var searchParams = new URLSearchParams(queryString);
var returnTo;
var param;
if (searchParams.has("l")) {
  console.log(searchParams.get("l").toString());
  returnTo = "/" + searchParams.get("l").toString();
  param = searchParams.get("l").toString();
} else {
  returnTo = "/";
  param = "";
}
onAuthStateChanged(
  getAuth(),
  (user) => {
    if (user) {
      var email = user.email;
      signInButton.style.display = "none";
      signedInDropdown.style.display = "flex";
      document.getElementById("accountButton").textContent = email;
      getDoc(doc(db, "users", `${user.uid}`)).then((userDoc) => {
        if (userDoc.exists) {
          window.location = returnTo;
        } else {
          window.location = `/onboarding?l=${encodeURIComponent(param)}`;
        }
      });
    } else {
      signInButton.style.display = "block";
      signedInDropdown.style.display = "none";
      var uiConfig = {
        signInSuccessUrl: `/onboarding?l=${encodeURIComponent(param)}`,
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        tosUrl: "https://www.google.com",
        privacyPolicyUrl: function () {
          window.location.assign("https://www.google.com");
        },
      };
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  },
  function (error) {
    console.log(error);
  }
);

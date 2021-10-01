// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
  appId: "1:383036367934:web:a7daed4de45c1d6b389d6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// var signInButton = document.getElementById("signInButton");
// var signedInDropdown = document.getElementById("signedInDropdown");

// var popularEventsList = document.getElementById("upcomingEvents");
// initApp = function() {
//     var db = firebase.firestore();
//     document.getElementById("algoliaSearch").addEventListener("focusin", function() {
//         document.querySelector(".searchSuggestions").style.display = "block";
//     });
//     document.getElementById("algoliaSearch").addEventListener("focusout", function() {
//         document.querySelector(".searchSuggestions").style.display = "none";
//     });
//     firebase.auth().onAuthStateChanged(
//         function(user) {
//             if (user) {
//                 // User is signed in.
//                 var email = user.email;
//                 signInButton.style.display = "none";
//                 signedInDropdown.style.display = "flex";
//                 document.getElementById("accountButton").textContent = email;
//                 db.collection("users")
//                     .doc(user.uid)
//                     .get()
//                     .then((userDoc) => {
//                         if (userDoc.exists) {
//                             if (userDoc.data().accountType == "standard") {
//                                 db.collection("upcomingEvents")
//                                     .orderBy("visits", "desc")
//                                     .limit(10)
//                                     .get()
//                                     .then((querySnapshot) => {
//                                         querySnapshot.forEach((doc) => {
//                                             addEventCard(doc, "popularEvents");
//                                         });
//                                     });
//                                 db.collection("upcomingEvents")
//                                     .orderBy("DateTime")
//                                     .limit(10)
//                                     .get()
//                                     .then((querySnapshot) => {
//                                         querySnapshot.forEach((doc) => {
//                                             addEventCard(doc, "upcomingEvents");
//                                         });
//                                     });
//                                 db.collection("upcomingEvents")
//                                     .orderBy("adScale", "desc")
//                                     .orderBy("visits", "desc")
//                                     .limit(10)
//                                     .get()
//                                     .then((querySnapshot) => {
//                                         querySnapshot.forEach((doc) => {
//                                             addEventCard(doc, "recEvents");
//                                         });
//                                     });
//                             } else {
//                                 window.location = "/my-events";
//                             }
//                         } else {
//                             window.location = "/onboarding";
//                         }
//                     });
//             } else {
//                 // User is signed out.
//                 window.location = "/landing";
//             }
//         },
//         function(error) {
//             console.log(error);
//         }
//     );
// };
// window.addEventListener("load", function() {
//     initApp();
// });

// const convertFirstCharacterToUppercase = (stringToConvert) => {
//     var firstCharacter = stringToConvert.substring(0, 1);
//     var restString = stringToConvert.substring(1);
//     return firstCharacter.toUpperCase() + restString;
// };

// function dateToString(d) {
//     var date = new Date(d);
//     var month = date.getMonth();
//     var day = date.getDate();
//     var year = date.getFullYear();
//     var s = `${month}/${day}/${year}`;
//     return s;
// }

// function dateToTime(d) {
//     var date = new Date(d);
//     var hour =
//         date.getHours() <= 12 ?
//         date.getHours().toString().padStart(2, "0") :
//         (date.getHours() - 12).toString().padStart(2, "0");
//     var minute = date.getMinutes().toString().padStart(2, "0");
//     var isPM = date.getHours() < 12 ? "AM" : "PM";
//     var s = `${hour}:${minute} ${isPM}`;
//     return s;
// }

// function addEventCard(doc, parent) {
//     var parentList = document.getElementById(parent);
//     var imageURL = doc.data().ImageURL.toString();
//     var id = doc.id.toString();
//     var title = convertFirstCharacterToUppercase(doc.data().Name);
//     var dateString = dateToString(doc.data().DateTime.seconds * 1000);
//     var timeString = dateToTime(doc.data().DateTime.seconds * 1000);
//     var location = doc.data().Location.toString();
//     var organizer = doc.data().OrganizerName.toString();
//     var cost = (doc.data().Cost / 100).toFixed(2).toString();
//     var blurHash = encodeURIComponent(doc.data().MainHash);
//     var imgElement = `<img src="${imageURL}" alt="Event Brochure" width="100">`;

//     const eventTemplate = document.importNode(
//         document.getElementById("eventTemplate").content,
//         true
//     );
//     eventTemplate.querySelector("a").href = `/event/?e=${id}&i=${blurHash}&d=${
//     doc.data().ImageDim
//   }`;
//     eventTemplate.querySelector(".eventDivImg").innerHTML = imgElement;
//     eventTemplate.querySelector(".titleElement").innerHTML = title;
//     eventTemplate.querySelector(".dateElement").innerHTML = dateString;
//     eventTemplate.querySelector(".timeElement").innerHTML = timeString;
//     eventTemplate.querySelector(".locElement").innerHTML = location;
//     eventTemplate.querySelector(".orgElement").innerHTML = organizer;
//     eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
//     parentList.appendChild(eventTemplate);
// }
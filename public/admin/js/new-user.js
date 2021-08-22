var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData;
var loading = false;
var imgDim;
var initApp = function () {
  // var ihash;
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var email = user.email;
        db.collection("admin")
          .doc("general")
          .get()
          .then((adminDoc) => {
            if (!adminDoc.data().emails.includes(user.email)) {
              alert("Access not permitted");
              window.location = "/sign-out";
            } else {
              document
                .getElementById("send")
                .addEventListener("click", function () {
                  document.getElementById("send").disabled = true;
                  var aType = document.getElementById("acctType").value;
                  var name = document.getElementById("name").value;
                  var email = document.getElementById("email").value;
                  var stripe = document.getElementById("stripe").value;
                  addUser(name, email, aType, stripe);
                });
            }
          });
      } else {
        // User is signed out.
        window.location = "/sign-in";
      }
    },
    function (error) {
      console.log(error);
    }
  );
};
window.addEventListener("load", function () {
  initApp();
});

function addUser(name, email, aType, stripe) {
  if (stripe.toString() == "") {
    firebase
      .firestore()
      .collection("users")
      .add({
        name: name,
        email: email,
        accountType: aType,
        accountCreated: new Date(Date.now()),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("progress").value = 100;
        window.location = "/";
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        document.getElementById("send").disabled = false;
        document.getElementById("progress").value = 0;
        alert("something went wrong. Try again in a few moments.");
      });
  } else {
    firebase
      .firestore()
      .collection("users")
      .add({
        name: name,
        email: email,
        accountType: aType,
        stripeCustomerID: stripe,
        accountCreated: new Date(Date.now()),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("progress").value = 100;
        window.location = "/";
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        document.getElementById("send").disabled = false;
        document.getElementById("progress").value = 0;
        alert("something went wrong. Try again in a few moments.");
      });
  }
}

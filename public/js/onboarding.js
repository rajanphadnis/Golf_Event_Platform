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
if (searchParams.has("l")) {
  console.log(searchParams.get("l").toString());
  returnTo = "/" + searchParams.get("l").toString();
} else {
  returnTo = "/";
}
initApp = function () {
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              window.location = returnTo;
            } else {
              document.getElementById("mainParent").style.display = "block";
              document
                .getElementById("standard")
                .addEventListener("click", function () {
                  document.getElementById("hint").innerText =
                    "Loading...Please do not refresh the page.";
                  document.getElementById("options").style.display = "none";
                  var newTransaction = firebase
                    .functions()
                    .httpsCallable("createSubscription");
                  if (userDoc.get("stripeCustomerID") == undefined) {
                    console.log(
                      `Transmitting: ${user.displayName.toString()}, ${user.uid.toString()}, ${
                        user.email
                      }, ${window.location.href.toString()}`
                    );
                    newTransaction({
                      userName: user.displayName.toString(),
                      uid: user.uid.toString(),
                      backURL: window.location.href.toString(),
                      customerID: "null",
                      userEmail: user.email,
                    })
                      .then((result) => {
                        // Read result of the Cloud Function.
                        var checkoutURL = result.data.returnURL;
                        console.log(checkoutURL);
                        window.location = checkoutURL;
                      })
                      .catch((er) => {
                        console.log(er);
                        document.getElementById("hint").innerText =
                          "Error. Please Refresh the Page.";
                      });
                  } else {
                    newTransaction({
                      userName: user.displayName.toString(),
                      uid: user.uid.toString(),
                      backURL: window.location.href.toString(),
                      customerID: userDoc.data().stripeCustomerID.toString(),
                      userEmail: user.email,
                    })
                      .then((result) => {
                        // Read result of the Cloud Function.
                        var checkoutURL = result.data.returnURL;
                        console.log(checkoutURL);
                        window.location = checkoutURL;
                      })
                      .catch((er) => {
                        // document.getElementById("registerButton").disabled = false;
                        console.log(er);
                        document.getElementById("hint").innerText =
                          "Error. Please Refresh the Page.";
                      });
                  }
                });
              document
                .getElementById("charity")
                .addEventListener("click", function () {
                  document.getElementById("options").style.display = "none";
                  document.getElementById("charityName").style.display =
                    "block";
                });
              document
                .getElementById("submitCharityName")
                .addEventListener("click", function () {
                  addUser(
                    document.getElementById("charityNameInput").value,
                    user.email,
                    user.uid,
                    "charity"
                  );
                });
            }
          });
      } else {
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

function addUser(displayName, email, uid, type) {
  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .set({
      name: displayName,
      email: email,
      accountCreated: new Date(Date.now()),
      accountType: type,
    })
    .then((docRef) => {
      // console.log("Document written with ID: ", docRef.id);
      window.location = returnTo;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
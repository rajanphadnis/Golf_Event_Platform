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
              db.collection("archivedUsers")
                .doc(user.uid)
                .get()
                .then((archUserDoc) => {
                  if (archUserDoc.exists) {
                    window.location = "/account-management";
                  } else {
                    db.collection("deletedUsers")
                      .doc(user.uid)
                      .get()
                      .then((delUser) => {
                        if (delUser.exists) {
                          document.getElementById("mainParent").style.display =
                            "block";
                          // document.getElementById("options").style.display =
                          //   "none";
                          document.getElementById("hint").innerText =
                            "Press the above button to contnue to the payment screen to get view events";
                          document.getElementById(
                            "mainQuestion"
                          ).style.display = "none";
                          document.getElementById("charity").style.display =
                            "none";
                          document.getElementById("standard").innerHTML =
                            "Confirm";
                          document
                            .getElementById("standard")
                            .addEventListener("click", function () {
                              createUserTransactionPage(user, returnTo);
                            });
                          // createUserTransactionPage(user, returnTo);
                        } else {
                          document.getElementById("mainParent").style.display =
                            "block";
                          document
                            .getElementById("standard")
                            .addEventListener("click", function () {
                              createUserTransactionPage(user, returnTo);
                            });
                          document
                            .getElementById("charity")
                            .addEventListener("click", function () {
                              document.getElementById("options").style.display =
                                "none";
                              document.getElementById(
                                "charityName"
                              ).style.display = "block";
                            });
                          document
                            .getElementById("submitCharityName")
                            .addEventListener("click", function () {
                              addUser(
                                document.getElementById("charityNameInput")
                                  .value,
                                user.email,
                                user.uid,
                                "charity"
                              );
                            });
                        }
                      });
                  }
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

function createUserTransactionPage(user, returnTo) {
  var db = firebase.firestore();
  document.getElementById("hint").innerText =
    "Loading...Please do not refresh the page.";
  document.getElementById("options").style.display = "none";
  db.collection("admin")
    .doc("general")
    .get()
    .then((adminDoc) => {
      if (adminDoc.data().enableSubscription) {
        var newTransaction = firebase
          .functions()
          .httpsCallable("createSubscription");
        db.collection("archivedUsers")
          .doc(user.uid.toString())
          .get()
          .then((aUsers) => {
            if (aUsers.exists) {
              console.log(
                `Transmitting: ${user.displayName.toString()}, ${user.uid.toString()}, ${
                  user.email
                }, ${window.location.href.toString()}`
              );
              newTransaction({
                userName: user.displayName.toString(),
                uid: user.uid.toString(),
                backURL: window.location.href.toString(),
                customerID: aUsers.data().stripeCustomerID.toString(),
                userEmail: user.email,
                trial: false,
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
              db.collection("deletedUsers")
                .doc(user.uid.toString())
                .get()
                .then((deleteDoc) => {
                  if (deleteDoc.exists) {
                    console.log(
                      `Transmitting: ${user.displayName.toString()}, ${user.uid.toString()}, ${
                        user.email
                      }, ${window.location.href.toString()}`
                    );
                    newTransaction({
                      userName: user.displayName.toString(),
                      uid: user.uid.toString(),
                      backURL: window.location.href.toString(),
                      customerID: deleteDoc.data().stripeCustomerID.toString(),
                      userEmail: user.email,
                      trial: false,
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
                      trial: true,
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
                  }
                });
            }
          });
      } else {
        db.collection("archivedUsers")
          .doc(user.uid.toString())
          .get()
          .then((aUsers) => {
            if (aUsers.exists) {
              db.collection("users")
                .doc(user.uid.toString())
                .set(aUsers.data())
                .then((t) => {
                  db.collection("archivedUsers")
                    .doc(user.uid.toString())
                    .delete()
                    .then((g) => {
                      window.location = returnTo;
                    });
                });
            } else {
              db.collection("deletedUsers")
                .doc(user.uid.toString())
                .get()
                .then((deletedDoc) => {
                  if (deletedDoc.exists) {
                    db.collection("users")
                      .doc(user.uid.toString())
                      .set(deletedDoc.data())
                      .then((t) => {
                        db.collection("deletedUsers")
                          .doc(user.uid.toString())
                          .delete()
                          .then((g) => {
                            window.location = returnTo;
                          });
                      });
                  } else {
                    db.collection("users")
                      .doc(user.uid.toString())
                      .set({
                        accountCreated: new Date(Date.now()),
                        accountType: "standard",
                        email: user.email.toString(),
                        name: user.displayName.toString(),
                      })
                      .then((g) => {
                        window.location = returnTo;
                      });
                  }
                });
            }
          });
      }
    });
}

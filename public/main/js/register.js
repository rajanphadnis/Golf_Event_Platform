initApp = function () {
  const uri = window.location.search;
  var queryString;
  var hash;
  var hDim;
  try {
    queryString = decodeURI(uri);
  } catch (e) {
    // catches a malformed URI
    console.error(e);
    queryString = uri;
  }
  var searchParams = new URLSearchParams(queryString);
  var eventID;
  if (searchParams.has("e") && searchParams.has("i") && searchParams.has("d")) {
    eventID = searchParams.get("e").toString();
    if (eventID == "") {
      window.location = "/";
    }
    hash = searchParams.get("i").toString();
    if (hash == "") {
      window.location = "/";
    }
    hDim = searchParams.get("d").toString();
    if (hDim == "") {
      window.location = "/";
    }
  } else {
    window.location = "/";
  }
  // var img = new Image()
  var width =
    (document.body.offsetWidth ? document.body.offsetWidth : document.width) *
    0.3;
  var height = width * hDim;
  blurhash.decodePromise(hash, width, height).then((blurhashImgData) => {
    // as image object with onload callback
    const imgObject = blurhash.getImageDataAsImage(
      blurhashImgData,
      width,
      height,
      (event, imgObject) => {
        document.getElementById("eventImageMain").src = imgObject.src;
      }
    );
  });
  var signInButton = document.getElementById("signInButton");
  var signedInDropdown = document.getElementById("signedInDropdown");
  var eventTitleBlock = document.getElementById("eventTitle");
  var db = firebase.firestore();
  // var docRef = ;
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        // User is signed in.
        var email = user.email;
        signInButton.style.display = "none";
        signedInDropdown.style.display = "flex";
        document.getElementById("accountButton").textContent = email;
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              if (userDoc.data().accountType == "standard") {
                db.collection("upcomingEvents")
                  .doc(eventID)
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      document.title =
                        "Register - " +
                        doc.data().Name.toString() +
                        " | Golf4Bob";
                      document.getElementById("eventTitle").innerText =
                        doc.data().Name;
                      document.getElementById("eventImageMain").src =
                        doc.data().ImageURL;
                        
                      var button = document.createElement("button");
                      button.id = "registerButton";
                      button.innerText = "I Agree";
                      console.log(userDoc.get("stripeCustomerID"));
                      if (userDoc.get("stripeCustomerID") == undefined) {
                        console.log(`returning null`);
                        button.addEventListener("click", () => {
                          agree(
                            eventID,
                            user.uid,
                            hash,
                            hDim,
                            doc.data().Cost,
                            doc.data().Name,
                            doc.data().MaxParticipants,
                            doc.data().ImageURL,
                            user.email,
                            "null",
                            doc.data().stripeOrgID
                          );
                        });
                        document
                          .getElementById("eventContentMainFlex")
                          .appendChild(button);
                        // return "null";
                      } else {
                        console.log(`returning with StripeID`);
                        button.addEventListener("click", () => {
                          agree(
                            eventID,
                            user.uid,
                            hash,
                            hDim,
                            doc.data().Cost,
                            doc.data().Name,
                            doc.data().MaxParticipants,
                            doc.data().ImageURL,
                            user.email,
                            userDoc.data().stripeCustomerID.toString(),
                            doc.data().stripeOrgID
                          );
                        });
                        document
                          .getElementById("eventContentMainFlex")
                          .appendChild(button);
                        // return doc.data().stripeCustomerID.toString();
                      }
                      db.collection("admin").doc("generalPageInfo").get().then((adminDoc) => {
                        document.getElementById("agreement").srcdoc = adminDoc.data().eventRegistrationAgreement;
                      });
                      // });
                    } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                      alert(
                        "hmm... Something went wrong. Try again in a few minutes"
                      );
                      window.location = "/404.html";
                    }
                  })
                  .catch((error) => {
                    console.log("Error getting document:", error);
                    // window.location = "/404.html";
                  });
              } else {
                window.location = "/404.html";
              }
            } else {
              var encodedURL = encodeURIComponent(
                `event/register/?e=${eventID}&i=${hash}&d=${hDim}`
              );
              window.location = `/onboarding?l=${encodedURL}`;
            }
          });
      } else {
        // User is signed out.
        // signInButton.style.display = "block";
        // signedInDropdown.style.display = "none";
        var encodedURL = encodeURIComponent(
          `event/register?e=${eventID}&i=${hash}&d=${hDim}`
        );
        window.location = `/sign-in?l=${encodedURL}`;
        // document.getElementById(
        //   "signInButton"
        // ).href = `/sign-in?l=${encodedURL}`;
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

// function getStripeID(uid) {
//   firebase
//     .firestore()
//     .collection("users")
//     .doc(uid)
//     .get()
//     .then((doc) => {
//       console.log(doc.get("stripeCustomerID"));
//       if (doc.get("stripeCustomerID") == undefined) {
//         console.log(`returning null`);
//         return "null";
//       } else {
//         console.log(`returning: ${doc.data().stripeCustomerID.toString()}`);
//         return doc.data().stripeCustomerID.toString();
//       }
//     });
// }

function agree(
  dID,
  uID,
  hash,
  hDim,
  cost,
  name,
  eventMaxParticipants,
  checkoutImage,
  email,
  stripeID,
  stripeOrgID
) {
  document.getElementById("registerButton").disabled = true;
  document.getElementById("registerButton").innerText = "Processing...";
  console.log("agreed");
  // console.log(`ID: ${dID}`);
  var db = firebase.firestore();
  db.collection("admin")
    .doc("general")
    .get()
    .then((adminDoc) => {
      if (adminDoc.data().enablePerEventRegistration) {
        var newTransaction = firebase
          .functions()
          .httpsCallable("createTransaction");
        console.log(
          `Transmitting: ${dID}, ${uID}, ${cost}, ${name}, ${stripeID}, ${stripeOrgID}`
        );
        newTransaction({
          eventDoc: dID,
          uid: uID,
          eventCost: cost,
          eventName: name,
          backURL: window.location.href.toString(),
          eventMaxParticipants: eventMaxParticipants,
          checkoutImage: checkoutImage,
          customerID: stripeID.toString(),
          userEmail: email,
          stripeUID: stripeOrgID,
          perPaymentFee: adminDoc.data().perPaymentFee
        })
          .then((result) => {
            // Read result of the Cloud Function.
            var checkoutURL = result.data.returnURL;
            console.log(checkoutURL);
            window.location = checkoutURL;
          })
          .catch((er) => {
            // document.getElementById("registerButton").disabled = false;
            document.getElementById("registerButton").innerText =
              "Error. Please Refresh the Page.";
          });
      } else {
        db.collection(`upcomingEvents/${dID}/registeredUsers`).add({
          uid: uID.toString(),
          dt: new Date(Date.now()),
          paidRegistration: false,
        }).then((f) => {
          window.location = `/event/?e=${encodeURIComponent(dID)}&i=${encodeURIComponent(hash)}&d=${encodeURIComponent(hDim)}`;
        });
      }
    });
}

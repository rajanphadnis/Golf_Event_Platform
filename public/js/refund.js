initApp = function () {
  const uri = window.location.search;
  var queryString;
  try {
    queryString = decodeURI(uri);
  } catch (e) {
    console.error(e);
    queryString = uri;
  }
  var searchParams = new URLSearchParams(queryString);
  var eventID;
  if (searchParams.has("e")) {
    eventID = searchParams.get("e").toString();
    if (eventID == "") {
      window.location = "/";
    }
  } else {
    window.location = "/";
  }
  var signInButton = document.getElementById("signInButton");
  var signedInDropdown = document.getElementById("signedInDropdown");
  var eventTitleBlock = document.getElementById("eventTitle");
  var db = firebase.firestore();
  var docRef = db.collection("upcomingEvents").doc(eventID);
  var userDocRef;
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var email = user.email;
        signInButton.style.display = "none";
        signedInDropdown.style.display = "flex";
        document.getElementById("accountButton").textContent = email;
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              db.collection(`upcomingEvents/${eventID}/registeredUsers`)
                .where("uid", "==", user.uid)
                .get()
                .then((docSnapshot) => {
                  if (docSnapshot.docs.length != 0) {
                    var button = document.createElement("button");
                    button.id = "registerButton";
                    button.innerText = "Refund Me";
                    button.addEventListener("click", () => {
                      agree(eventID, docSnapshot.docs[0].id);
                    });
                    document
                      .getElementById("eventContentMainFlex")
                      .appendChild(button);
                  } else {
                    window.location = "/";
                  }
                });
            } else {
              var encodedURL = encodeURIComponent(
                `event/register/?e=${eventID}&i=${hash}&d=${hDim}`
              );
              window.location = `/onboarding?l=${encodedURL}`;
            }
          });
      } else {
        signInButton.style.display = "block";
        signedInDropdown.style.display = "none";
        var encodedURL = encodeURIComponent(
          `event/register?e=${eventID}&i=${hash}&d=${hDim}`
        );
        document.getElementById(
          "signInButton"
        ).href = `/sign-in?l=${encodedURL}`;
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

function agree(dID, uDocRef) {
  console.log("agreed");
  // console.log(`ID: ${dID}`);
  // console.log(`ID: ${uDocRef}`);
  var db = firebase.firestore();
  db.collection(`upcomingEvents/${dID}/registeredUsers`)
    .doc(uDocRef)
    .get()
    .then((rUserDoc) => {
      if (rUserDoc.data().paidRegistration) {
        firebase
          .functions()
          .httpsCallable("refundSingleTransaction")({
            eventID: dID,
            regID: uDocRef,
            uid: rUserDoc.data().uid,
            paymentID: rUserDoc.data().paymentIntent,
          })
          .then((result) => {
            // Read result of the Cloud Function.
            console.log(result);
            var completedOrNot = result.data.completed;
            if (completedOrNot) {
              window.location = "/my-events";
            } else {
              alert(
                "whoops, something went wrong - try again in a few moments"
              );
            }
          })
          .catch((error) => {
            var code = error.code;
            var message = error.message;
            var details = error.details;
            alert(message.toString());
          });
      } else {
        db.collection(`upcomingEvents/${dID}/registeredUsers`)
          .doc(uDocRef)
          .delete()
          .then(() => {
            window.location = "/";
          });
      }
    })
    .catch((er) => {
      alert(er);
    });
}

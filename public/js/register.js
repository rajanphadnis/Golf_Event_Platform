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
  var docRef = db.collection("upcomingEvents").doc(eventID);
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        // User is signed in.
        var email = user.email;
        signInButton.style.display = "none";
        signedInDropdown.style.display = "flex";
        document.getElementById("accountButton").textContent = email;
        db.collection("users")
          .where("email", "==", user.email.toString())
          .get()
          .then((snap) => {
            return snap.docs.length != 0 ? true : false;
          })
          .then((hasUser) => {
            db.collection("charities")
              .where("email", "==", user.email.toString())
              .get()
              .then((snap) => {
                var hasCharity = snap.docs.length != 0 ? true : false;
                if (hasUser || hasCharity) {
                  // window.location = returnTo;
                  docRef
                    .get()
                    .then((doc) => {
                      if (doc.exists) {
                        document.title =
                          "Register - " +
                          doc.data().Name.toString() +
                          " | Golf_Event_Platform";
                        document.getElementById("eventTitle").innerText =
                          doc.data().Name;
                        document.getElementById("eventImageMain").src =
                          doc.data().ImageURL;
                        var button = document.createElement("button");
                        button.id = "registerButton";
                        button.innerText = "I Agree";
                        button.addEventListener("click", () => {
                          agree(eventID, user.uid, hash, hDim, doc.data().Name, doc.data().Cost);
                        });
                        document
                          .getElementById("eventContentMainFlex")
                          .appendChild(button);
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
                  console.log("logged in");
                } else {
                  var encodedURL = encodeURIComponent(
                    `event/register/?e=${eventID}&i=${hash}&d=${hDim}`
                  );
                  window.location = `/onboarding?l=${encodedURL}`;
                }
              });
          });
      } else {
        // User is signed out.
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

function agree(dID, uID, hash, hDim, cost, name) {
  console.log("agreed");
  // console.log(`ID: ${dID}`);
  var newTransaction = firebase.functions().httpsCallable("createTransaction");
  newTransaction({ eventDoc: dID, uid: uID , eventCost: cost, eventName: name})
    .then((result) => {
      // Read result of the Cloud Function.
      var sanitizedMessage = result.data.returnURL;
      console.log(sanitizedMessage);
    })
    .then((f) => {
      // Future: redirect to stripe checkout url generated from server (generated on
      // page load). Success URL is in then() of current
      // Current: fullfill order with no payment.
      var db = firebase.firestore();
      db.collection(`upcomingEvents/${dID}/registeredUsers`)
        .add({
          uid: uID.toString(),
          dt: new Date(Date.now()),
        })
        .then((t) => {
          window.location =
            "/event?e=" +
            encodeURIComponent(`${dID}`) +
            "&i=" +
            encodeURIComponent(`${hash}`) +
            "&d=" +
            encodeURIComponent(`${hDim}`);
        })
        .catch((er) => {
          alert(er);
        });
    });
}

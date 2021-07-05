const uri = window.location.search;
var queryString;
var hash;
var hDim;
try {
  console.log(uri);
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

console.log(hash);
console.log(width);
console.log(height);
blurhash.decodePromise(hash, width, height, 1).then((blurhashImgData) => {
  // console.log(blurhashImgData.length / 4);
  // as image object with onload callback
  var imgObject = blurhash.getImageDataAsImage(
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

initApp = function () {
  var db = firebase.firestore();
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
                  // console.log("logged in");
                } else {
                  var encodedURL = encodeURIComponent(
                    `event/?e=${eventID}&i=${hash}&d=${hDim}`
                  );
                  window.location = `/onboarding?l=${encodedURL}`;
                }
              });
          });
        document
          .getElementById("register")
          .addEventListener("click", function () {
            window.location = `/event/register?e=${encodeURIComponent(
              eventID
            )}&i=${encodeURIComponent(hash)}&d=${encodeURIComponent(hDim)}`;
          });
      } else {
        // User is signed out.
        signInButton.style.display = "block";
        signedInDropdown.style.display = "none";
        var encodedURL = encodeURIComponent(
          `event?e=${eventID}&i=${hash}&d=${hDim}`
        );
        document.getElementById(
          "signInButton"
        ).href = `/sign-in?l=${encodedURL}`;
        document
          .getElementById("register")
          .addEventListener("click", function () {
            var toEncode = `event/register?e=${eventID}&i=${hash}&d=${hDim}`;
            var laterLocation = encodeURIComponent(toEncode);
            // console.log(laterLocation);
            window.location = `/sign-in/?l=${laterLocation}`;
          });
      }
    },
    function (error) {
      console.log(error);
    }
  );
  var docRef = db.collection("upcomingEvents").doc(eventID);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if (doc.data().ImageURL.toString() == "client") {
        //   firebase
        //     .app()
        //     .storage("gs://golf-event-platform")
        //     .ref(doc.id.toString() + ".jpg")
        //     .getDownloadURL()
        //     .then((url) => {
        //       document.getElementById("eventImageMain").src = url;
        //       return firebase
        //         .firestore()
        //         .collection("upcomingEvents")
        //         .doc(doc.id.toString())
        //         .set(
        //           {
        //             ImageURL: url,
        //           },
        //           { merge: true }
        //         );
        //     });
        // } else {
        document.getElementById("eventImageMain").src = doc.data().ImageURL;
        // }
        // console.log("Document data:", doc.data());
        document.getElementById("eventTitle").innerText = doc.data().Name;
        document.title = doc.data().Name.toString() + " | Golf_Event_Platform";
        document.getElementById("eventLocation").innerHTML =
          '<span class="material-icons">place</span>' + doc.data().Location;
        document.getElementById("eventDateTime").innerText = new Date(
          doc.data().DateTime.seconds * 1000
        ).toString();
        document.getElementById("eventOrganizer").innerText =
          doc.data().OrganizerName;
        document.getElementById("eventBlurb").innerHTML = doc.data().Blurb;
        // document.getElementById("eventImageMain").src = doc.data().ImageURL;
        document.getElementById("register").style.display = "block";
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        alert("hmm... Something went wrong. Try again in a few minutes");
        window.location = "/";
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};
window.addEventListener("load", function () {
  initApp();
});

initApp = function () {
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
    console.log(hash);
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

  // console.log(hash);
  // console.log(width);
  // console.log(height);
  blurhash.decodePromise(hash, width, height, 1).then((blurhashImgData) => {
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
  var db = firebase.firestore();
  var visits = new sharded.Counter(
    db.doc(`upcomingEvents/${eventID}`),
    "visits"
  );
  visits.incrementBy(1);
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
              db.collection(`upcomingEvents/${eventID}/registeredUsers`)
                .where("uid", "==", user.uid.toString())
                .get()
                .then((sn) => {
                  if (sn.docs.length != 0) {
                    document.getElementById("register").innerText =
                      "Unregister From Event";
                    document
                      .getElementById("register")
                      .addEventListener("click", function () {
                        window.location = `/event/refund?e=${encodeURIComponent(
                          eventID
                        )}&i=${encodeURIComponent(hash)}&d=${encodeURIComponent(
                          hDim
                        )}`;
                      });
                  } else {
                    document.getElementById("register").innerText =
                      "Register For Event";
                    document
                      .getElementById("register")
                      .addEventListener("click", function () {
                        window.location = `/event/register?e=${encodeURIComponent(
                          eventID
                        )}&i=${encodeURIComponent(hash)}&d=${encodeURIComponent(
                          hDim
                        )}`;
                      });
                  }
                });
            } else {
              var encodedURL = encodeURIComponent(
                `event/?e=${eventID}&i=${hash}&d=${hDim}`
              );
              window.location = `/onboarding?l=${encodedURL}`;
            }
          });
      } else {
        // User is signed out.
        var encodedURL = encodeURIComponent(
          `event?e=${eventID}&i=${hash}&d=${hDim}`
        );
        window.location = `/sign-in?l=${encodedURL}`;
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
        document.getElementById("eventImageMain").src = doc.data().ImageURL;
        document.getElementById("eventTitle").innerText = doc.data().Name;
        document.title = doc.data().Name.toString() + " | Golf4Bob";
        document.getElementById("eventLocation").innerHTML =
          `<span class="material-icons">place</span><a target="_blank" href="https://www.google.com/maps/place/${doc.data().plusCode}"><h3>${doc.data().Location}</h3></a>`;
        document.getElementById("eventDateTime").innerHTML = `<span class="material-icons">
        event
        </span><h3>${dateToString(
          doc.data().DateTime.seconds * 1000
        )}</h3>`;
        document.getElementById("eventCost").innerText = `$${
          doc.data().Cost / 100
        }/Person`;
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

function dateToString(d) {
  var date = new Date(d);
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear();
  var hour =
    date.getHours() <= 12
      ? date.getHours().toString().padStart(2, "0")
      : (date.getHours() - 12).toString().padStart(2, "0");
  var minute = date.getMinutes().toString().padStart(2, "0");
  var isPM = date.getHours() < 12 ? "AM" : "PM";
  var s = `${month}/${day}/${year} - ${hour}:${minute} ${isPM}`;
  return s;
}

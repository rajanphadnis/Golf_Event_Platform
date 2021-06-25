const uri = window.location.search;
var queryString;
var hash;
try {
    queryString = decodeURI(uri);
} catch (e) { // catches a malformed URI
    console.error(e);
    queryString = uri;
}
var searchParams = new URLSearchParams(queryString);
var eventID;
if (searchParams.has("e") && searchParams.has("i")) {
    eventID = searchParams.get("e").toString();
    if (eventID == "") {
        window.location = "/";
    }
    hash = searchParams.get("i").toString();
    if (hash == "") {
        window.location = "/";
    }
}
else {
    window.location = "/";
}
// var img = new Image()
var width = (document.body.offsetWidth ? document.body.offsetWidth : document.width) * 0.3;
blurhash.decodePromise(
    hash,
    width,
    width,
).then(blurhashImgData => {
    // as image object with onload callback
    const imgObject = blurhash.getImageDataAsImage(
        blurhashImgData,
        width,
        width,
        (event, imgObject) => {
            imgObject.id = "eventImageMain"
            document.getElementById("eventImage").appendChild(imgObject);
        }
    );
});
var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");
var eventTitleBlock = document.getElementById("eventTitle");

initApp = function () {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
            document.getElementById("register").addEventListener("click", function() {
                window.location = `/event/register?e=${encodeURIComponent(eventID)}&i=${encodeURIComponent(hash)}`;
            });
        } else {
            // User is signed out.
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            document.getElementById("register").addEventListener("click", function() {
                var toEncode = `event/register?e=${eventID}&i=${hash}`;
                var laterLocation = encodeURIComponent(toEncode);
                console.log(laterLocation);
                window.location = `/sign-in/?l=${laterLocation}`;
            });
        }
    }, function (error) {
        console.log(error);
    });
    var docRef = db.collection("upcomingEvents").doc(eventID);

    docRef.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().ImageURL.toString() == "client") {
                firebase
                  .storage("gs://golf-event-platform")
                  .ref(doc.id.toString() + ".jpg")
                  .getDownloadURL()
                  .then((url) => {
                    document.getElementById("eventImageMain").src = url;
                    return db.collection("upcomingEvents").doc(doc.id.toString()).set(
                      {
                        ImageURL: url,
                      },
                      { merge: true }
                    );
                  });
              } else {
                document.getElementById("eventImageMain").src = doc.data().ImageURL;
              }
            // console.log("Document data:", doc.data());
            document.getElementById("eventTitle").innerText = doc.data().Name;
            document.getElementById("eventLocation").innerHTML = '<span class="material-icons">place</span>' + doc.data().Location;
            document.getElementById("eventDateTime").innerText = new Date(doc.data().DateTime.seconds * 1000).toString();
            document.getElementById("eventOrganizer").innerText = doc.data().OrganizerName;
            document.getElementById("eventBlurb").innerHTML = doc.data().Blurb;
            // document.getElementById("eventImageMain").src = doc.data().ImageURL;
            document.getElementById("register").style.display = "block";
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            alert("hmm... Something went wrong. Try again in a few minutes");
            window.location = "/";
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

};
window.addEventListener('load', function () {
    initApp()
});
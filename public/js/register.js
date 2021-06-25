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
        } else {
            // User is signed out.
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
        }
    }, function (error) {
        console.log(error);
    });
    var docRef = db.collection("upcomingEvents").doc(eventID);

    docRef.get().then((doc) => {
        if (doc.exists) {
            document.getElementById("eventTitle").innerText = doc.data().Name;
            if (doc.data().ImageURL.toString() == "client") {
                firebase
                  .storage()
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
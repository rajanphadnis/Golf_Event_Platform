const uri = window.location.search;
var queryString;
try {
    queryString = decodeURI(uri);
} catch (e) { // catches a malformed URI
    console.error(e);
    queryString = uri;
}
var searchParams = new URLSearchParams(queryString);
var returnTo;
if (searchParams.has("l")) {
    console.log(searchParams.get("l").toString());
    returnTo = "/" + searchParams.get("l").toString();
}
else {
    returnTo = "/";
}
initApp = function () {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").where("email", "==", user.email.toString()).get().then((snap) => {
                return snap.docs.length != 0 ? true : false;
            }).then((hasUser) => {
                db.collection("charities").where("email", "==", user.email.toString()).get().then((snap) => {
                    var hasCharity = snap.docs.length != 0 ? true : false;
                    if(hasUser || hasCharity) {
                        window.location = returnTo;
                    }
                    else {
                        document.getElementById("mainParent").style.display = "block";
                        document.getElementById("standard").addEventListener("click", function () {
                            document.getElementById("options").style.display = "none";
                            addUser(user.displayName, user.email, user.uid);
                        });
                        document.getElementById("charity").addEventListener("click", function () {
                            document.getElementById("options").style.display = "none";
                            document.getElementById("charityName").style.display = "block";
                        });
                        document.getElementById("submitCharityName").addEventListener("click", function () {
                            // document.getElementById("options").style.display = "none";
                            addCharity(document.getElementById("charityNameInput").value, user.email, user.uid);
                        });
                    }
                })
            });
        } else {
            window.location = "/sign-in";
        }
    }, function (error) {
        console.log(error);
    })
};
window.addEventListener('load', function () {
    initApp()
});

function addUser(displayName, email, uid) {
    firebase.firestore().collection("users").doc(uid).set({
        name: displayName,
        email: email,
        accountCreated: new Date(Date.now()),
    })
    .then((docRef) => {
        // console.log("Document written with ID: ", docRef.id);
        window.location = returnTo;
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}
function addCharity(charityName, email, uid) {
    firebase.firestore().collection("charities").doc(uid).set({
        name: charityName,
        email: email,
        accountCreated: new Date(Date.now()),
    })
    .then((docRef) => {
        // console.log("Document written with ID: ", docRef.id);
        window.location = returnTo;
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}
const uri = window.location.search;
var queryString;
try {
    queryString = decodeURI(uri);
} catch (e) { // catches a malformed URI
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
}
else {
    window.location = "/";
}
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
    eventTitleBlock.innerHTML = eventID;
};
window.addEventListener('load', function () {
    initApp()
});
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
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
            window.location = returnTo;
        } else {
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            // FirebaseUI config.
            var uiConfig = {
                signInSuccessUrl: returnTo,
                signInOptions: [
                    // Leave the lines as is for the providers you want to offer your users.
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                ],
                // tosUrl and privacyPolicyUrl accept either url string or a callback
                // function.
                // Terms of service url/callback.
                tosUrl: 'https://www.google.com',
                // Privacy policy url/callback.
                privacyPolicyUrl: function () {
                    window.location.assign('https://www.google.com');
                }
            };

            // Initialize the FirebaseUI Widget using Firebase.
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }, function (error) {
        console.log(error);
    })
};
window.addEventListener('load', function () {
    initApp()
});

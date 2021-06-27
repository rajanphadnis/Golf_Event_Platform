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
var param;
if (searchParams.has("l")) {
    console.log(searchParams.get("l").toString());
    returnTo = "/" + searchParams.get("l").toString();
    param = searchParams.get("l").toString();
}
else {
    returnTo = "/";
    param = "";
}
initApp = function () {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
            db.collection("users").where("email", "==", user.email.toString()).get().then((snap) => {
                return snap.docs.length != 0 ? true : false;
            }).then((hasUser) => {
                db.collection("charities").where("email", "==", user.email.toString()).get().then((snap) => {
                    var hasCharity = snap.docs.length != 0 ? true : false;
                    if(hasUser || hasCharity) {
                        window.location = returnTo;
                    }
                    else {
                        window.location = `/onboarding?l=${encodeURIComponent(param)}`;
                    }
                })
            });
            // window.location = returnTo;
        } else {
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            // FirebaseUI config.
            var uiConfig = {
                signInSuccessUrl: `/onboarding?l=${encodeURIComponent(param)}`,
                // signInSuccessUrl: returnTo,
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

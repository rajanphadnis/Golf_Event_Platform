var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");
// var signedInDropdown = document.getElementById("signedInDropdown");
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
        } else {
            // User is signed out.
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            // document.getElementById('sign-in-status').textContent = 'Signed out';
        }
    }, function (error) {
        console.log(error);
    });
};
window.addEventListener('load', function () {
    initApp()
});
var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");
// var signedInDropdown = document.getElementById("signedInDropdown");
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
            // User is signed in.
            firebase.auth().signOut().then(function() {
                window.location = "/";
              }).catch(function(error) {
                alert("Something happened. Try again in a few minutes");
              });
        } else {
            // User is signed out.
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            window.location = "/";
        }
    }, function (error) {
        console.log(error);
    });
};
window.addEventListener('load', function () {
    initApp()
});
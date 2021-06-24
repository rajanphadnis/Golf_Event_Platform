initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
            document.getElementById("firebaseui-auth-container").innerHTML = "Hello, " + user.displayName.toString();
        } else {
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            window.location = "/sign-in?l=account";
        }
    }, function (error) {
        console.log(error);
    })
};
window.addEventListener('load', function () {
    initApp()
});

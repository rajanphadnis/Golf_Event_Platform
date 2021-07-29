initApp = function () {
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var email = user.email;
        signInButton.style.display = "none";
        signedInDropdown.style.display = "flex";
        document.getElementById("accountButton").textContent = email;
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              var par = `<p id="message">Hello, ${user.displayName}</p>`;
              document.getElementById("firebaseui-auth-container").innerHTML =
                par;
            } else {
              db.collection("archivedUsers")
                .doc(user.uid.toString())
                .get()
                .then((aUsers) => {
                  if (aUsers.exists) {
                    var par = `<p id="message">Hello, ${user.displayName}</p>`;
                    document.getElementById(
                      "firebaseui-auth-container"
                    ).innerHTML = par;
                  } else {
                    window.location = "/onboarding?l=account";
                  }
                });
            }
          });
      } else {
        signInButton.style.display = "block";
        signedInDropdown.style.display = "none";
        window.location = "/sign-in?l=account";
      }
    },
    function (error) {
      console.log(error);
    }
  );
};
window.addEventListener("load", function () {
  initApp();
});

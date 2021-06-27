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
          .where("email", "==", user.email.toString())
          .get()
          .then((snap) => {
            return snap.docs.length != 0 ? true : false;
          })
          .then((hasUser) => {
            db.collection("charities")
              .where("email", "==", user.email.toString())
              .get()
              .then((snap) => {
                var hasCharity = snap.docs.length != 0 ? true : false;
                if (hasUser || hasCharity) {
                  // window.location = returnTo;
                  console.log("logged in");
                } else {
                  window.location = "/onboarding?l=account";
                }
              });
          });
        document.getElementById("firebaseui-auth-container").innerHTML =
          "Hello, " + user.displayName.toString();
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

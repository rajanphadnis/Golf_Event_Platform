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
              console.log("logged in");
              var par = `<p id="message">Hello, ${user.displayName}</p>`;
              document.getElementById("firebaseui-auth-container").innerHTML =
                par;
              var newTransaction = firebase
                .functions()
                .httpsCallable("fetchUserPortal");
              newTransaction({
                customerID: userDoc.data().stripeCustomerID.toString(),
                redir: window.location.href.toString(),
              })
                .then((result) => {
                  // Read result of the Cloud Function.
                  var redirURL = result.data.returnURL;
                  var manageButton = `<button onclick="window.location = '${redirURL}'">Manage Payments and Subscriptions</button>`;
                  console.log(redirURL);
                  document.getElementById(
                    "firebaseui-auth-container"
                  ).innerHTML = par + manageButton;
                  // window.location = redirURL;
                })
                .catch((er) => {
                  console.log(er);
                  document.getElementById("message").innerHTML =
                    "Error. Please Refresh the Page.";
                });
            } else {
              window.location = "/onboarding?l=account";
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

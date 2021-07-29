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
              var newTransaction = firebase
                .functions()
                .httpsCallable("fetchUserPortal");
              newTransaction({
                customerID: userDoc.data().stripeCustomerID.toString(),
                redir: window.location.href.toString(),
              })
                .then((result) => {
                  var redirURL = result.data.returnURL;
                  console.log(redirURL);
                  window.location = redirURL;
                })
                .catch((er) => {
                  console.log(er);
                });
            } else {
              db.collection("archivedUsers")
                .doc(user.uid.toString())
                .get()
                .then((aUsers) => {
                  if (aUsers.exists) {
                    var newTransaction = firebase
                      .functions()
                      .httpsCallable("fetchUserPortal");
                    newTransaction({
                      customerID: aUsers.data().stripeCustomerID.toString(),
                      redir: window.location.href.toString(),
                    })
                      .then((result) => {
                        var redirURL = result.data.returnURL;
                        console.log(redirURL);
                        window.location = redirURL;
                      })
                      .catch((er) => {
                        console.log(er);
                      });
                  } else {
                    window.location = "/landing";
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

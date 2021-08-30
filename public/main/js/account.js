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
          .then(async (userDoc) => {
            if (userDoc.exists) {
              var par = `<p id="message">Hello, ${user.displayName}</p>`;
              document.getElementById("firebaseui-auth-container").innerHTML =
                par;
              if (userDoc.data().accountType == "charity") {
                db.collection(`users/${user.uid}/stripeConnect`)
                  .doc("accountCreation")
                  .get()
                  .then((docExists) => {
                    console.log(docExists);
                    if (docExists.exists) {
                      if (docExists.data().charges_enabled) {
                        var connectButton = `<a href="https://dashboard.stripe.com/${
                          docExists.data().id
                        }/dashboard" class="stripe-connect slate"><span>Open</span></a>`;
                        document.getElementById("charityStripeData").innerHTML =
                          connectButton;
                      } else {
                        var checkRegistrationStatus = firebase
                          .functions()
                          .httpsCallable("stripeRegistrationCheck");
                        checkRegistrationStatus({
                          acct: docExists.data().id,
                          uid: user.uid,
                        }).then((res) => {
                          if (res.charges_enabled) {
                            var connectButton = `<a href="https://dashboard.stripe.com/${
                              docExists.data().id
                            }/dashboard" class="stripe-connect slate"><span>Open</span></a>`;
                            document.getElementById(
                              "charityStripeData"
                            ).innerHTML = connectButton;
                          } else {
                            registerCharityWithStripe(user.uid);
                          }
                        });
                      }
                    } else {
                      registerCharityWithStripe(user.uid);
                    }
                  });
              }
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

function registerCharityWithStripe(userID) {
  var createAccount = firebase
    .functions()
    .httpsCallable("createConnectPortalLink");
  var createLink = firebase
    .functions()
    .httpsCallable("resumeConnectPortalCreation");
  createAccount({ uid: userID }).then((result) => {
    // Read result of the Cloud Function.
    var returnID = result.data.returnID;
    createLink({ uid: returnID, userID: userID }).then((res) => {
      var returnURL = res.data.returnURL;
      var connectButton = `<a href="${returnURL}" class="stripe-connect slate"><span>Link with</span></a>`;
      document.getElementById("charityStripeData").innerHTML = connectButton;
    });
  });
}

initApp = function() {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(
        function(user) {
            if (user) {
                var email = user.email;
                signInButton.style.display = "none";
                signedInDropdown.style.display = "flex";
                document.getElementById("accountButton").textContent = email;
                db.collection("users")
                    .doc(user.uid)
                    .get()
                    .then(async(userDoc) => {
                        if (userDoc.exists) {
                            document.getElementById("accountInfo").innerHTML = `<h3>Here's everything we know about you:</h3><p>Account Created: ${convertFBDateToJS(userDoc.data().accountCreated)}</p><p>Email: ${userDoc.data().email}</p><p>Account Owner Name: ${user.displayName}</p>`;
                            if (userDoc.data().accountType == "charity") {
                                document.getElementById("manageBilling").style.display = "none";
                                var par = `<h1 id="message">${userDoc.data().name}</h1><hr style="width:20%;"/><h4>Charity Portal</h4>`;
                                document.getElementById("firebaseui-auth-container").innerHTML =
                                    par;
                                db.collection(`users/${user.uid}/stripeConnect`)
                                    .doc("accountCreation")
                                    .get()
                                    .then((docExists) => {
                                        // console.log(docExists);
                                        if (docExists.exists) {
                                            if (docExists.data().charges_enabled) {
                                              document.getElementById("stripeButton").style.display = "flex";
                                                document.getElementById("stripeButton").href = `https://dashboard.stripe.com/${
                                                docExists.data().id
                                              }/dashboard`;
                                                document.getElementById("stripeButtonText").innerHTML = "Open";
                                                //                         var connectButton = `<a href="https://dashboard.stripe.com/${
                                                //   docExists.data().id
                                                // }/dashboard" class="stripe-connect slate"><span>Open</span></a>`;
                                                // document.getElementById("charityStripeData").innerHTML =
                                                //     connectButton;
                                            } else {
                                                var checkRegistrationStatus = firebase
                                                    .functions()
                                                    .httpsCallable("stripeRegistrationCheck");
                                                checkRegistrationStatus({
                                                    acct: docExists.data().id,
                                                    uid: user.uid,
                                                }).then((res) => {
                                                    // console.log(res);
                                                    if (res.data.charges_enabled) {
                                                      document.getElementById("stripeButton").style.display = "flex";
                                                        document.getElementById("stripeButton").href = `https://dashboard.stripe.com/${
                                                        docExists.data().id
                                                      }/dashboard`;
                                                        document.getElementById("stripeButtonText").innerHTML = "Open";
                                                    } else {
                                                        registerCharityWithStripe(user.uid);
                                                    }
                                                });
                                            }
                                        } else {
                                            registerCharityWithStripe(user.uid);
                                        }
                                    });
                            } else {
                                var par = `<h1 id="message">Hello, ${user.displayName}</h1>`;
                                document.getElementById("firebaseui-auth-container").innerHTML =
                                    par;
                                document.getElementById(
                                    "charityStripeData"
                                ).innerHTML = "";
                                document.getElementById("accountActions").style.justifyContent = "center";
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
        function(error) {
            console.log(error);
        }
    );
};
window.addEventListener("load", function() {
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
            document.getElementById("stripeButton").style.display = "flex";
            document.getElementById("stripeButton").href = returnURL;
            document.getElementById("stripeButtonText").innerHTML = "Link with";
            // var connectButton = `<a href="${returnURL}" class="stripe-connect slate"><span>Link with</span></a>`;
            // document.getElementById("charityStripeData").innerHTML = connectButton;
        });
    });
}

function convertFBDateToJS(date) {
    var date = new Date(date.seconds * 1000);
    var day = date.getDate().toString();
    var month = (date.getMonth() + 1).toString();
    var year = date.getFullYear().toString();
    var hour = date.getHours().toString();
    var min = date.getMinutes().toString();

    var today = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year} @ ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
    return today;
}
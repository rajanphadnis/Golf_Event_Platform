var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");
var hasntAddedNewScript = true;
var initApp = function () {
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var email = user.email;
        signInButton.style.display = "none";
        signedInDropdown.style.display = "flex";
        document.getElementById("accountButton").textContent = email;
        if (hasntAddedNewScript) {
          db.collection("users")
            .where("email", "==", user.email.toString())
            .get()
            .then((snap) => {
              return snap.docs.length != 0 ? "true" : "false";
            })
            .then((hasUser) => {
              db.collection("charities")
                .where("email", "==", user.email.toString())
                .get()
                .then((snap) => {
                  var hasCharity = snap.docs.length != 0 ? true : false;
                  if (hasUser == "true") {
                    
                    // document.getElementById("standardPage").style.display =
                    //   "block";
                    var script2 = document.createElement("script");
                    script2.setAttribute("src", "/js/myEvents/standard.js");
                    document.getElementById("newScript").appendChild(script2);
                    hasAddedNewScript = false;
                    //   var style2 = document.createElement("link");
                    //   style2.setAttribute("rel", "stylesheet");
                    //   style2.setAttribute("src", "/css/my-events/standard.css");
                    //   document.getElementById("mainHead").appendChild(style2);
                  } else if (hasCharity) {
                    var script2 = document.createElement("script");
                    script2.setAttribute("src", "/js/myEvents/charity.js");
                    document.getElementById("newScript").appendChild(script2);
                    // document.getElementById("newScript").innerHTML = '<script src="/js/myEvents/charity.js"></script>';
                    hasAddedNewScript = false;
                    //   var style2 = document.createElement("link");
                    //   style2.setAttribute("rel", "stylesheet");
                    //   style2.setAttribute("src", "/css/my-events/charity.css");
                    //   document.getElementById("mainHead").appendChild(style2);
                  } else {
                    window.location = "/onboarding?l=my-events";
                  }
                });
            });
        }
        else {
          console.log("has already added script");
        }
      } else {
        // User is signed out.
        signInButton.style.display = "block";
        signedInDropdown.style.display = "none";
        window.location = "/sign-in?l=my-events";
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

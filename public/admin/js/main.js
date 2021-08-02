initApp = function () {
    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
            var db = firebase.firestore();
            db.collection("admin").doc("general").get().then((adminDoc) => {
                if (!adminDoc.data().emails.includes(user.email)) {
                    document.getElementById("loadingMessage").innerHTML = "not approved";
                    // window.location = "/sign-in";
                }
                else {
                    document.getElementById("loadingMessage").innerHTML = "not loading";
                }
            });
        } else {
          window.location = "/sign-in";
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
  
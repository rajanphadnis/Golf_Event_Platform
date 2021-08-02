initApp = function () {
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var db = firebase.firestore();
        db.collection("admin")
          .doc("general")
          .get()
          .then((adminDoc) => {
            if (!adminDoc.data().emails.includes(user.email)) {
              document.getElementById("loadingMessage").innerHTML =
                "not approved";
              // window.location = "/sign-in";
            } else {
              document.getElementById("loadingMessage").innerHTML =
                "not loading";
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

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      window.location = "/";
    })
    .catch(function (error) {
      alert("Something happened. Try again in a few minutes");
    });
}

function navigate(page) {
    columnTwo = document.getElementById("columnTwo");
    switch (page) {
        case "users":
            columnTwo.innerHTML = "USERS";
            break;
        case "events":
            columnTwo.innerHTML = "EVENTS";
            break;
        case "pay":
            columnTwo.innerHTML = "PAYMENT MANAGEMENT";
            break;
        case "legal":
            columnTwo.innerHTML = "LEGAL EDITOR";
            break;
        case "cost":
            columnTwo.innerHTML = "COST SUMMARY";
            break;
        default:
            break;
    }
}
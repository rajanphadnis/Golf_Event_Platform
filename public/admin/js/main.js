var loader = `<div class="spinner slabs" id="slabs"><div class="slab"></div><div class="slab"></div><div class="slab"></div><div class="slab"></div></div>`;
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
            }
            else {
                document.getElementById("mainBody").style.display = "flex";
                document.getElementById("loadingMessage").style.display = "none";
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
    switch (page) {
        case "users":
            initUsers();
            break;
        case "events":
            initEvents();
            break;
        case "pay":
            initPay();
            break;
        case "legal":
            initLegal();
            break;
        case "cost":
            initCost();
            break;
        case "stats":
            initStats();
            break;
        case "openStripe":
            window.open("https://dashboard.stripe.com", "_blank");
            break;
        case "openSite":
            window.open("https://golf-event-platform.web.app", "_blank");
            break;
        default:
            break;
    }
}

function initUsers() {
    columnTwo = document.getElementById("columnTwo");
    columnTwo.innerHTML = "USERS";
}

function initEvents() {
    columnTwo = document.getElementById("columnTwo");
    columnTwo.innerHTML = "EVENTS";
}

function initPay() {
    columnTwo = document.getElementById("columnTwo");
    columnTwo.innerHTML = loader;
    var link = document.querySelector('link[rel="import"]');
    var content = link.import;

    // Grab DOM from warning.html's document.
    var el = content.querySelector('#payDIV');

    // document.body.appendChild();
    columnTwo.innerHTML = "";
    columnTwo.appendChild(el.cloneNode(true));
    // var db = firebase.firestore();
    // db.collection("admin").doc("general").get().then((adminDoc) => {
    //   var boxes = `<div><p>Per-Event Payments and Registrations: ${adminDoc.data().enablePerEventRegistration ? "Enabled" : "Disabled"}</p><button class="learn-more">
    //   <span class="circle" aria-hidden="true">
    //     <span class="icon arrow"></span>
    //   </span>
    //   <span class="button-text">${adminDoc.data().enablePerEventRegistration ? "Disable" : "Enable"}</span>
    // </button></div>`;
    //   columnTwo.innerHTML = boxes;
    // });
}

function initLegal() {
    columnTwo = document.getElementById("columnTwo");
    columnTwo.innerHTML = "LEGAL EDITOR";
}

function initCost() {
    columnTwo = document.getElementById("columnTwo");
    columnTwo.innerHTML = "COST SUMMARY";
}

function initStats() {
    columnTwo = document.getElementById("columnTwo");
    columnTwo.innerHTML = "STATISTICS";
}
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
            } else {
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
  columnTwo.innerHTML = "LOADING...";
  var db = firebase.firestore();
  db.collection("upcomingEvents")
    .get()
    .then((snap) => {
      columnTwo.innerHTML = "";
      const div1 = document.createElement("div");
      div1.id = "columnTwoOne";
      var div2 = document.createElement("div");
      div2.id = "columnTwoTwo";
      div2.innerHTML = "TWOOO";
      snap.docs.forEach(doc => {
        const instance = document.importNode(
          document.getElementById("eventCookieCutter").content,
          true
        );
        instance.querySelector(".eventTitle").innerHTML = doc.data().Name;
        instance.querySelector(".eventDate").innerHTML = new Date(doc.data().DateTime.seconds).toLocaleString();
        instance.querySelector(".eventTemplateButton").onclick = function () {
          showEditRowEvents(doc.data(), doc.id);
        }
        div1.appendChild(instance);
      });
      columnTwo.appendChild(div1);
      columnTwo.appendChild(div2);
    });
}

function initPay() {
  columnTwo = document.getElementById("columnTwo");
  columnTwo.innerHTML = "";
  columnTwo.innerHTML = loader;
  var db = firebase.firestore();
  db.collection("admin")
    .doc("general")
    .get()
    .then((adminDoc) => {
      columnTwo.innerHTML = "";
      var note = document.createElement("p");
      note.innerHTML =
        "Note: Changing these settings will only apply to NEW transactions and users.</br>Example: Subscriptions are diabled when a user signs up.</br>You then turn on Subscriptions. That user will not have to pay a subscription fee to continue to view the site.</br>Any new user will have to pay for a subscription to access the site.";
      columnTwo.appendChild(note);
      const instance1 = document.importNode(
        document.getElementById("payTemplate").content,
        true
      );
      instance1.querySelector(
        "#labelText"
      ).innerHTML = `Per Event Payment and Registration: ${
        adminDoc.data().enablePerEventRegistration ? "Enabled" : "Disabled"
      }`;
      instance1.querySelector("#buttonText").innerHTML = `${
        adminDoc.data().enablePerEventRegistration ? "Disable" : "Enable"
      }`;
      instance1.querySelector("#actionButton").onclick = function () {
        columnTwo.innerHTML = "";
        columnTwo.innerHTML = loader;
        db.collection("admin")
          .doc("general")
          .update({
            enablePerEventRegistration: adminDoc.data()
              .enablePerEventRegistration
              ? false
              : true,
          })
          .then(() => {
            initPay();
          });
      };
      columnTwo.appendChild(instance1);
      const instance2 = document.importNode(
        document.getElementById("payTemplate").content,
        true
      );
      instance2.querySelector("#labelText").innerHTML = `Subscription: ${
        adminDoc.data().enableSubscription ? "Enabled" : "Disabled"
      }`;
      instance2.querySelector("#buttonText").innerHTML = `${
        adminDoc.data().enableSubscription ? "Disable" : "Enable"
      }`;
      instance2.querySelector("#actionButton").onclick = function () {
        columnTwo.innerHTML = "";
        columnTwo.innerHTML = loader;
        db.collection("admin")
          .doc("general")
          .update({
            enableSubscription: adminDoc.data().enableSubscription
              ? false
              : true,
          })
          .then(() => {
            initPay();
          });
      };
      columnTwo.appendChild(instance2);
    });
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

function showEditRowEvents(data, id) {
  document.getElementById("columnTwoTwo").innerHTML = "";
  const instance = document.importNode(
    document.getElementById("eventEdit").content,
    true
  );
  instance.getElementById("editNameP").innerHTML = `Event Name: ${data.Name}`;
  instance.getElementById("editDateP").innerHTML = `Event Date and Time: ${data.DateTime.toDate().toLocaleString()}`;
  instance.getElementById("editCostP").innerHTML = `Cost Per Person: $${data.Cost/100}`;
  instance.getElementById("editImageURLP").innerHTML = `ImageURL: ${data.ImageURL}`;
  instance.getElementById("editLocationP").innerHTML = `Location: ${data.Location}`;
  instance.getElementById("editLastUpdatedP").innerHTML = `Last Updated: ${data.LastUpdated.toDate().toLocaleString()}`;
  instance.getElementById("editMaxParticipantsP").innerHTML = `Max Participants: ${data.MaxParticipants.toString()}`;
  instance.getElementById("editOrganizerP").innerHTML = `Organizer: ${data.OrganizerName}`;
  instance.getElementById("editBlurbP").innerHTML = `Blurb: ${data.Blurb}`;
  document.getElementById("columnTwoTwo").appendChild(instance);
}
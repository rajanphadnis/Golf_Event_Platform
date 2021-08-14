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
      try {
        tinymce.activeEditor.destroy();
      } catch (e) {
        console.log("tiny destroy no object");
      }
      initUsers();
      break;
    case "events":
      try {
        tinymce.activeEditor.destroy();
      } catch (e) {
        console.log("tiny destroy no object");
      }
      initEvents();
      break;
    case "pay":
      try {
        tinymce.activeEditor.destroy();
      } catch (e) {
        console.log("tiny destroy no object");
      }
      initPay();
      break;
    case "legal":
      try {
        tinymce.activeEditor.destroy();
      } catch (e) {
        console.log("tiny destroy no object");
      }
      initLegal();
      break;
    case "cost":
      try {
        tinymce.activeEditor.destroy();
      } catch (e) {
        console.log("tiny destroy no object");
      }
      initCost();
      break;
    case "stats":
      try {
        tinymce.activeEditor.destroy();
      } catch (e) {
        console.log("tiny destroy no object");
      }
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
      snap.docs.forEach((doc) => {
        const instance = document.importNode(
          document.getElementById("eventCookieCutter").content,
          true
        );
        instance.querySelector(".eventTitle").innerHTML = doc.data().Name;
        instance.querySelector(".eventDate").innerHTML = doc
          .data()
          .DateTime.toDate()
          .toLocaleString();
        instance.querySelector(".eventTemplateButton").onclick = function () {
          showEditRowEvents(doc.data(), doc.id);
        };
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
  try {
    tinymce.activeEditor.destroy();
  } catch (e) {
    console.log("tiny destroy no object");
  }
  document.getElementById("columnTwoTwo").innerHTML = "";
  const instance = document.importNode(
    document.getElementById("eventInfo").content,
    true
  );
  instance.getElementById("title").value = data.Name;
  instance.getElementById("dt").value = convertFBDateToJS(data.DateTime);
  instance.getElementById("cost").value = data.Cost;
  instance.getElementById(
    "editImageURLP"
  ).innerHTML = `Image: <a href="${data.ImageURL}">View</a>`;
  instance.getElementById("location").value = data.Location;
  instance.getElementById(
    "editLastUpdatedP"
  ).innerHTML = `Last Updated: ${data.LastUpdated.toDate().toLocaleString()}`;
  instance.getElementById("maxParticipants").value = data.MaxParticipants;
  instance.getElementById(
    "editOrganizerP"
  ).value = `Organizer: ${data.OrganizerName}`;

  instance.getElementById("htmeditor").innerHTML = data.Blurb;
  document.getElementById("columnTwoTwo").appendChild(instance);
  tinymce.init({
    selector: "#htmeditor",
  });
  // tinymce.get("htmeditor").setContent(data.Blurb);
}

function convertFBDateToJS(date) {
  var date = new Date(date.seconds * 1000);
  var day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear(),
    hour = date.getHours(),
    min = date.getMinutes();

  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;

  var today = year + "-" + month + "-" + day + "T" + hour + ":" + min;
  return today;
}

function addEvent(
  did,
  title,
  loc,
  dt,
  cost,
  max,
  blurb,
  poster,
  uid,
  charityName,
  dim
  // hash
) {
  // console.log(hash);
  firebase
    .firestore()
    .collection("upcomingEvents")
    .doc(did)
    .set({
      Name: title,
      MaxParticipants: parseInt(max),
      Blurb: blurb.toString(),
      Cost: parseInt(cost),
      DateTime: new Date(Date.parse(dt)),
      Location: loc.toString(),
      LastUpdated: new Date(Date.now()),
      OrganizerID: uid.toString(),
      OrganizerName: charityName.toString(),
      ImageDim: parseFloat(dim),
      // MainHash: hash.toString(),
    }, {merge: true})
    .then((docRef) => {
      console.log("Document written with ID: ", did);
      uploadFile(poster, did);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
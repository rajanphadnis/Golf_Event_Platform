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
  columnTwo.innerHTML = "LOADING...";
  var db = firebase.firestore();
  db.collection("users")
    .orderBy("accountCreated")
    .limit(10)
    .get()
    .then((snap) => {
      columnTwo.innerHTML = "";
      const div1 = document.createElement("div");
      div1.id = "columnTwoOne";
      const div3 = document.createElement("div");
      div3.id = "listColumn";
      var div2 = document.createElement("div");
      div2.id = "columnTwoTwo";
      div2.innerHTML = "Select or search for a user on the left.";
      db.collection("admin")
        .doc("counters")
        .get()
        .then((counterDoc) => {
          const headerInstance = document.importNode(
            document.getElementById("userHeader").content,
            true
          );
          headerInstance.getElementById(
            "userListHeaderH1"
          ).innerHTML = `Total # of Users: ${counterDoc.data().users}`;
          headerInstance
            .getElementById("userHeaderSearch")
            .addEventListener("click", () => {
              searchUsers();
            });
          div1.appendChild(headerInstance);
          snap.docs.forEach((doc) => {
            const instance = document.importNode(
              document.getElementById("userCookieCutter").content,
              true
            );
            instance.querySelector(".userTitle").innerHTML = doc.data().name;
            instance.querySelector(".userType").innerHTML =
              doc.data().accountType.toUpperCase();
            instance.querySelector(".userTemplateButton").onclick =
              function () {
                showEditRowUsers(doc.data(), doc.id);
              };
            div3.appendChild(instance);
          });
          div1.appendChild(div3);
          columnTwo.appendChild(div1);
          columnTwo.appendChild(div2);
        });
    });
}

function initEvents() {
  columnTwo = document.getElementById("columnTwo");
  columnTwo.innerHTML = "LOADING...";
  var db = firebase.firestore();
  db.collection("upcomingEvents")
    .orderBy("DateTime")
    .limit(10)
    .get()
    .then((snap) => {
      columnTwo.innerHTML = "";
      const div1 = document.createElement("div");
      div1.id = "columnTwoOne";
      const div3 = document.createElement("div");
      div3.id = "listColumn";
      var div2 = document.createElement("div");
      div2.id = "columnTwoTwo";
      div2.innerHTML = "Select or search for an event on the left.";
      db.collection("admin")
        .doc("counters")
        .get()
        .then((counterDoc) => {
          const headerInstance = document.importNode(
            document.getElementById("eventHeader").content,
            true
          );
          headerInstance.getElementById(
            "eventListHeaderH1"
          ).innerHTML = `Total # of Events: ${
            counterDoc.data().upcomingEvents
          }`;
          headerInstance
            .getElementById("eventHeaderSearch")
            .addEventListener("click", () => {
              searchUsers();
            });
          div1.appendChild(headerInstance);
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
            instance.querySelector(".eventTemplateButton").onclick =
              function () {
                showEditRowEvents(doc.data(), doc.id);
              };
            div3.appendChild(instance);
          });
          div1.appendChild(div3);
          columnTwo.appendChild(div1);
          columnTwo.appendChild(div2);
        });
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
      var mainCol = document.createElement("div");
      mainCol.id = "listColumn";
      columnTwo.innerHTML = "";
      var note = document.createElement("p");
      note.innerHTML =
        "Note: Changing these settings will only apply to NEW transactions and users.</br>Example: Subscriptions are diabled when a user signs up.</br>You then turn on Subscriptions. That user will not have to pay a subscription fee to continue to view the site.</br>Any new user will have to pay for a subscription to access the site.";
      mainCol.appendChild(note);
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
      mainCol.appendChild(instance1);
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
      mainCol.appendChild(instance2);
      columnTwo.appendChild(mainCol);
    });
}

function initLegal() {
  columnTwo = document.getElementById("columnTwo");
  columnTwo.innerHTML = "";
  var db = firebase.firestore();
  var mainCol = document.createElement("div");
  mainCol.id = "listColumn";
  db.collection("admin")
    .doc("generalPageInfo")
    .get()
    .then((adminDoc) => {
      const instance1 = document.importNode(
        document.getElementById("legalTemplate").content,
        true
      );
      instance1.getElementById("legalAgreement").innerHTML =
        adminDoc.data().eventRegistrationAgreement;

      instance1.getElementById("legalSave").addEventListener("click", () => {
        db.collection("admin")
          .doc("generalPageInfo")
          .update({
            eventRegistrationAgreement: tinymce.activeEditor.getContent(),
          })
          .then((f) => {
            document.getElementById(
              "saveStatus"
            ).innerHTML = `Last Saved at ${formatCurrentTime()}`;
          });
      });
      mainCol.appendChild(instance1);
      columnTwo.appendChild(mainCol);
      tinymce.init({
        selector: "#legalAgreement",
      });
    });
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
  instance.getElementById("editOrganizerP").value = data.OrganizerName;

  instance.getElementById("htmeditor").innerHTML = data.Blurb;
  instance.getElementById("send").addEventListener("click", () => {
    document.getElementById("progress").style.display = "block";
    addEvent(
      id,
      document.getElementById("title").value,
      document.getElementById("location").value,
      document.getElementById("dt").value,
      document.getElementById("cost").value,
      document.getElementById("maxParticipants").value,
      tinymce.activeEditor.getContent(),
      document.getElementById("editOrganizerP").value
    );
  });
  document.getElementById("columnTwoTwo").appendChild(instance);
  tinymce.init({
    selector: "#htmeditor",
  });
  // tinymce.get("htmeditor").setContent(data.Blurb);
}

function showEditRowUsers(data, id) {
  try {
    tinymce.activeEditor.destroy();
  } catch (e) {
    console.log("tiny destroy no object");
  }
  document.getElementById("columnTwoTwo").innerHTML = "";
  const instance = document.importNode(
    document.getElementById("userInfo").content,
    true
  );
  instance.getElementById("name").value = data.name;
  instance.getElementById("dt").value = convertFBDateToJS(data.accountCreated);
  instance.getElementById("email").value = data.email;
  instance.getElementById("acctType").value = data.accountType;
  instance.getElementById(
    "stripe"
  ).innerHTML = `Stripe Customer ID: <a target="_blank" href="https://dashboard.stripe.com/customers/${data.stripeCustomerID}">${data.stripeCustomerID}</a>`;
  instance.getElementById("id").innerHTML = `User ID: ${id}`;
  instance.getElementById("send").addEventListener("click", () => {
    document.getElementById("progress").style.display = "block";
    updateUser(
      id,
      document.getElementById("name").value,
      document.getElementById("dt").value,
      document.getElementById("email").value,
      document.getElementById("acctType").value
    );
  });
  document.getElementById("columnTwoTwo").appendChild(instance);
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
  charityName
  // hash
) {
  // console.log(hash);
  firebase
    .firestore()
    .collection("upcomingEvents")
    .doc(did)
    .set(
      {
        Name: title,
        MaxParticipants: parseInt(max),
        Blurb: blurb.toString(),
        Cost: parseInt(cost),
        DateTime: new Date(Date.parse(dt)),
        Location: loc.toString(),
        LastUpdated: new Date(Date.now()),
        OrganizerName: charityName.toString(),
        // MainHash: hash.toString(),
      },
      { merge: true }
    )
    .then((docRef) => {
      document.getElementById("progress").value = 100;
      document.getElementById("uploading").innerHTML =
        "Changes Saved. Refresh page to see updated information.";
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function updateUser(id, name, date, email, acctType) {
  firebase
    .firestore()
    .collection("users")
    .doc(id)
    .update({
      name: name,
      accountCreated: new Date(Date.parse(date)),
      email: email,
      accountType: acctType,
    })
    .then((docRef) => {
      document.getElementById("progress").value = 100;
      document.getElementById("uploading").innerHTML =
        "Changes Saved. Refresh page to see updated information.";
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function searchFxn() {
  var searchQ = document.getElementById("eventSearchInput").value;
  var db = firebase.firestore();
  db.collection("upcomingEvents")
    .where("Name", "==", searchQ)
    .get()
    .then((searchDocs) => {
      var dLengths = 0;
      document.getElementById("listColumn").innerHTML = "";
      document.getElementById("cancelSearch").style.display = "block";
      searchDocs.forEach((doc) => {
        dLengths += 1;
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
        document.getElementById("listColumn").appendChild(instance);
      });
      if (dLengths == 0) {
        document.getElementById("listColumn").innerHTML =
          "No Results Found. Only Exact Matches Will Be Shown.";
      }
      try {
        document.getElementById("listColumn").firstElementChild.click();
      } catch (e) {
        console.log(e);
      }
    });
}

function searchUsers() {
  var searchQ = document.getElementById("userSearchInput").value;
  var db = firebase.firestore();
  db.collection("users")
    .where("name", "==", searchQ)
    .get()
    .then((searchDocs) => {
      var dLengths = 0;
      document.getElementById("listColumn").innerHTML = "";
      document.getElementById("cancelSearch").style.display = "block";
      searchDocs.forEach((doc) => {
        dLengths += 1;
        const instance = document.importNode(
          document.getElementById("userCookieCutter").content,
          true
        );
        instance.querySelector(".userTitle").innerHTML = doc.data().name;
        instance.querySelector(".userType").innerHTML = doc.data().accountType;
        instance.querySelector(".userTemplateButton").onclick = function () {
          showEditRowUsers(doc.data(), doc.id);
        };
        document.getElementById("listColumn").appendChild(instance);
      });
      if (dLengths == 0) {
        document.getElementById("listColumn").innerHTML =
          "No Results Found. Only Exact Matches Will Be Shown.";
      }
      try {
        document.getElementById("listColumn").firstElementChild.click();
      } catch (e) {
        console.log(e);
      }
    });
}

function handle(e) {
  if (e.keyCode === 13) {
    e.preventDefault(); // Ensure it is only this code that runs
    searchFxn();
  }
}

function userHandle(e) {
  if (e.keyCode === 13) {
    e.preventDefault(); // Ensure it is only this code that runs
    searchUsers();
  }
}

function formatCurrentTime() {
  var hours = new Date().getHours();
  var mins = new Date().getMinutes().toString().padStart(2, "0");
  var seconds = new Date().getSeconds().toString().padStart(2, "0");
  var actualHrs = hours > 12 ? hours - 12 : hours;
  var ending = hours > 12 ? "PM" : "AM";
  return `${actualHrs}:${mins}:${seconds} ${ending}`;
}

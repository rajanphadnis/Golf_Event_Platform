var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");

var parentList = document.getElementById("upcomingEvents");
// var signedInDropdown = document.getElementById("signedInDropdown");
initApp = function () {
  var db = firebase.firestore();
  // const searchClient = algoliasearch('WPWFG61OL2', 'b91d438c108bc8fbab3cc293f699855b');
  // const search = instantsearch({
  //   indexName: "events_golf-event-platform",
  //   searchClient,
  // });

  // search.addWidgets([
  //   instantsearch.widgets.searchBox({
  //     container: "#search-container",
  //   }),

  //   instantsearch.widgets.hits({
  //     container: "#upcomingEvents",
  //   }),
  // ]);

  // search.start();
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        // User is signed in.
        var email = user.email;
        signInButton.style.display = "none";
        signedInDropdown.style.display = "flex";
        document.getElementById("accountButton").textContent = email;
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              if (userDoc.data().accountType == "standard") {
                db.collection("upcomingEvents")
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      // doc.data() is never undefined for query doc snapshots
                      // console.log(doc.id, " => ", doc.data());
                      parentList.innerHTML =
                        parentList.innerHTML +
                        addEventCard(
                          doc.data().Name,
                          doc.data().Location,
                          doc.data().Cost,
                          doc.data().DateTime,
                          doc.data().ImageURL,
                          doc.data().OrganizerName,
                          doc.id,
                          doc.data().MainHash,
                          doc.data().ImageDim
                        );
                    });
                  });
              } else {
                window.location = "/my-events";
              }
            } else {
              window.location = "/onboarding";
            }
          });
        // db.collection("users")
        //   .where("email", "==", user.email.toString())
        //   .get()
        //   .then((snap) => {
        //     return snap.docs.length != 0 ? true : false;
        //   })
        //   .then((hasUser) => {
        //     db.collection("charities")
        //       .where("email", "==", user.email.toString())
        //       .get()
        //       .then((snap) => {
        //         var hasCharity = snap.docs.length != 0 ? true : false;
        //         if (hasUser || hasCharity) {
        //           // window.location = returnTo;
        //           // console.log("logged in");
        //         } else {
        //           window.location = "/onboarding";
        //         }
        //       });
        //   });
      } else {
        // User is signed out.
        signInButton.style.display = "block";
        signedInDropdown.style.display = "none";
        db.collection("upcomingEvents")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              parentList.innerHTML =
                parentList.innerHTML +
                addEventCard(
                  doc.data().Name,
                  doc.data().Location,
                  doc.data().Cost,
                  doc.data().DateTime,
                  doc.data().ImageURL,
                  doc.data().OrganizerName,
                  doc.id,
                  doc.data().MainHash,
                  doc.data().ImageDim
                );
            });
          });
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

addEventCard = function (
  dbtitle,
  dblocation,
  dbcost,
  dbdatetime,
  dbimageURL,
  dborganizer,
  dbid,
  dbhash,
  dbDim
) {
  var imageURL;
  // if (dbimageURL.toString() == "client") {
  //   firebase
  //     .app()
  //     .storage("gs://golf-event-platform")
  //     .ref(dbid.toString() + ".jpg")
  //     .getDownloadURL()
  //     .then((url) => {
  //       imageURL = url;
  //       return firebase
  //         .firestore()
  //         .collection("upcomingEvents")
  //         .doc(dbid.toString())
  //         .set(
  //           {
  //             ImageURL: url,
  //           },
  //           { merge: true }
  //         );
  //     });
  // } else {
  imageURL = dbimageURL.toString();
  // }
  var id = dbid.toString();
  var title = convertFirstCharacterToUppercase(dbtitle);
  var dateTime = new Date(dbdatetime.seconds * 1000).toString();
  var location = dblocation.toString();
  var organizer = dborganizer.toString();
  var cost = (dbcost / 100).toFixed(2).toString();
  var blurHash = encodeURIComponent(dbhash);

  var imgElement = new String(
    `<img src="${imageURL}" alt="Event Brochure" width="100">`
  );
  var titleElement = new String(`<h2>${title}</h2>`);
  var subtextElement = new String(`<h3>${dateTime}, ${location}<h3>`);
  var otherSubtextElement = new String(
    `<p>By ${organizer}. $${cost}/person</p>`
  );
  var element = new String(
    `<a href="/event/?e=${id}&i=${blurHash}&d=${dbDim}"><div id="${id}">${imgElement}${titleElement}${subtextElement}${otherSubtextElement}</div></a>`
  );
  return element;
};
const convertFirstCharacterToUppercase = (stringToConvert) => {
  var firstCharacter = stringToConvert.substring(0, 1);
  var restString = stringToConvert.substring(1);

  return firstCharacter.toUpperCase() + restString;
};

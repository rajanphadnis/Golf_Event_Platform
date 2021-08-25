console.log("standard");
document.getElementById("standardPage").style.display = "flex";
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(
  function (user) {
    if (user) {
      displayStandardEvents(user.uid);
    } else {
      // User is signed out.
      alert("Sorry, something went wrong. Please try again in a few moments.");
      window.location = "/404.html";
    }
  },
  function (error) {
    console.log(error);
  }
);
function displayStandardEvents(uid) {
  console.log(uid);
  var mainParent = document.getElementById("standardMainContent");
  db.collectionGroup("registeredUsers")
    .where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
      //   console.log(querySnapshot);
      querySnapshot.forEach((preDoc) => {
        // console.log(doc.ref.parent.parent);
        var docc = preDoc.ref.parent.parent;
        docc.get().then((doc) => {
          var docTile = document.createElement("div");
          var eventTitle = `<div><a href="/event?e=${
            doc.id
          }&i=${encodeURIComponent(doc.data().MainHash)}&d=${
            doc.data().ImageDim
          }">${doc.data().Name}</a><div>`;
          // var editbutton = `<div><a href="/my-events/edit?d=${doc.id}">Edit Event</a></div>`;
          var deleteButton = `<div><a href="/event/refund?e=${encodeURIComponent(
            doc.id
          )}&i=${encodeURIComponent(doc.data().MainHash)}&d=${encodeURIComponent(
            doc.data().ImageDim
          )}">Unregister from Event</a></div>`;
          var longImage = `<div><img src="${
            doc.data().ImageURL
          }" width=150></div>`;

          var tallImage = `<div><img src="${
            doc.data().ImageURL
          }" height=40></div>`;

          docTile.className = "eventTile";
          if (doc.data().ImageDim >= 1) {
            docTile.innerHTML = tallImage + eventTitle + deleteButton;
          } else {
            docTile.innerHTML = longImage + eventTitle + deleteButton;
          }
          // docTile.innerHTML = `<p>${doc.id}</p>`;
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          mainParent.appendChild(docTile);
        });
      });
      document.getElementById("loadingIndicator").style.display = "none";
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

//   function deleteEvent(eventID) {
//     var canDelete = confirm("Are you sure you want to delete this event?");
//     if(canDelete) {
//       db.collection("upcomingEvents").doc(eventID).delete().then(() => {
//         console.log("Document successfully deleted!");
//         alert("Deleted Event! It may take a few minutes for the event to be fully deleted");
//         window.location = "/my-events";
//     }).catch((error) => {
//         console.error("Error removing document: ", error);
//         alert("Oh no! Something went wrong, please try again in a few minutes");
//     });
//     }
//   }

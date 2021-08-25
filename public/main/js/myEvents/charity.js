console.log("charity");
document.getElementById("charityPage").style.display = "flex";
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(
  function (user) {
    if (user) {
      displayCharityEvents(user.uid);
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

function displayCharityEvents(uid) {
  var mainParent = document.getElementById("charityMainContent");
  db.collection("/upcomingEvents")
    .where("OrganizerID", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var docTile = document.createElement("div");
        var eventTitle = `<div><a href="/event?e=${doc.id}&i=${encodeURIComponent(doc.data().MainHash)}&d=${doc.data().ImageDim}">${
          doc.data().Name
        }</a><div>`;
        var editbutton = `<div><a href="/my-events/edit?d=${
          doc.id
        }">Edit Event</a></div>`;
        var deleteButton = `<div><a href="#" onclick="deleteEvent('${doc.id}')">Delete Event</a></div>`;
        var longImage = `<div><img src="${
          doc.data().ImageURL
        }" width=150></div>`;

        var tallImage = `<div><img src="${
          doc.data().ImageURL
        }" height=40></div>`;

        docTile.className = "eventTile";
        if (doc.data().ImageDim >= 1) {
          docTile.innerHTML = tallImage + eventTitle + editbutton + deleteButton;
        }
        else {
          docTile.innerHTML = longImage + eventTitle + editbutton + deleteButton;
        }
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        mainParent.appendChild(docTile);
      });
      document.getElementById("loadingIndicator").style.display = "none";
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}


function deleteEvent(eventID) {
  var canDelete = confirm("Are you sure you want to delete this event?");
  if(canDelete) {
    db.collection("upcomingEvents").doc(eventID).delete().then(() => {
      console.log("Document successfully deleted!");
      alert("Deleted Event! It may take a few minutes for the event to be fully deleted");
      window.location = "/my-events";
  }).catch((error) => {
      console.error("Error removing document: ", error);
      alert("Oh no! Something went wrong, please try again in a few minutes");
  });
  }
}
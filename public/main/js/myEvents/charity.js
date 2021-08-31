console.log("charity");
document.getElementById("charityPage").style.display = "flex";
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(
    function(user) {
        if (user) {
            displayCharityEvents(user.uid);
        } else {
            // User is signed out.
            alert("Sorry, something went wrong. Please try again in a few moments.");
            window.location = "/404.html";
        }
    },
    function(error) {
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
                addEventCard(doc, "charityMainContent");
                // var docTile = document.createElement("div");
                // var eventTitle = `<div><a href="/event?e=${doc.id}&i=${encodeURIComponent(doc.data().MainHash)}&d=${doc.data().ImageDim}">${
                //   doc.data().Name
                // }</a><div>`;
                // var editbutton = `<div><a href="/my-events/edit?d=${
                //   doc.id
                // }">Edit Event</a></div>`;
                // var deleteButton = `<div><a href="#" onclick="deleteEvent('${doc.id}')">Delete Event</a></div>`;
                // var longImage = `<div><img src="${
                //   doc.data().ImageURL
                // }" width=150></div>`;

                // var tallImage = `<div><img src="${
                //   doc.data().ImageURL
                // }" height=40></div>`;

                // docTile.className = "eventTile";
                // if (doc.data().ImageDim >= 1) {
                //   docTile.innerHTML = tallImage + eventTitle + editbutton + deleteButton;
                // }
                // else {
                //   docTile.innerHTML = longImage + eventTitle + editbutton + deleteButton;
                // }
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                // mainParent.appendChild(docTile);
            });
            document.getElementById("loadingIndicator").style.display = "none";
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}


function deleteEvent(eventID) {
    var canDelete = confirm("Are you sure you want to delete this event?");
    if (canDelete) {
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

function addEventCard(doc, parent) {
    var parentList = document.getElementById(parent);
    var imageURL = doc.data().ImageURL.toString();
    var id = doc.id.toString();
    var title = convertFirstCharacterToUppercase(doc.data().Name);
    var dateString = dateToString(doc.data().DateTime.seconds * 1000);
    var timeString = dateToTime(doc.data().DateTime.seconds * 1000);
    var location = doc.data().Location.toString();
    var organizer = doc.data().OrganizerName.toString();
    var cost = (doc.data().Cost / 100).toFixed(2).toString();
    var blurHash = encodeURIComponent(doc.data().MainHash);
    var imgElement = `<img src="${imageURL}" alt="Event Brochure" width="100">`;

    const eventTemplate = document.importNode(
        document.getElementById("eventTemplate").content,
        true
    );
    console.log(eventTemplate);
    eventTemplate.querySelector(".eventClickA").href = `/event/?e=${id}&i=${blurHash}&d=${
  doc.data().ImageDim
}`;
    eventTemplate.querySelector(".eventDivImg").innerHTML = imgElement;
    eventTemplate.querySelector(".titleElement").innerHTML = title;
    eventTemplate.querySelector(".dateElement").innerHTML = dateString;
    eventTemplate.querySelector(".timeElement").innerHTML = timeString;
    eventTemplate.querySelector(".locElement").innerHTML = location;
    eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
    eventTemplate.querySelector(".editEvent").href = `/my-events/edit?d=${doc.id}`;
    eventTemplate.querySelector(".deleteEvent").addEventListener("click", () => {
      deleteEvent(id);
    });
    parentList.appendChild(eventTemplate);
}

const convertFirstCharacterToUppercase = (stringToConvert) => {
    var firstCharacter = stringToConvert.substring(0, 1);
    var restString = stringToConvert.substring(1);
    return firstCharacter.toUpperCase() + restString;
};

function dateToString(d) {
    var date = new Date(d);
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    var s = `${month}/${day}/${year}`;
    return s;
}

function dateToTime(d) {
    var date = new Date(d);
    var hour =
        date.getHours() <= 12 ?
        date.getHours().toString().padStart(2, "0") :
        (date.getHours() - 12).toString().padStart(2, "0");
    var minute = date.getMinutes().toString().padStart(2, "0");
    var isPM = date.getHours() < 12 ? "AM" : "PM";
    var s = `${hour}:${minute} ${isPM}`;
    return s;
}
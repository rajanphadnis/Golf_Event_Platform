console.log("charity");
document.getElementById("charityPage").style.display = "flex";
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(
    function(user) {
        if (user) {
            document.getElementById("upcomingCharity").style.backgroundColor = "#cecece";
            document.getElementById("upcomingCharity").style.border = "1px solid rgb(136, 136, 136)";
            document.getElementById("pastCharity").style.backgroundColor = "transparent";
            document.getElementById("pastCharity").style.border = "1px solid transparent";
            document.getElementById("charityMainContent").innerHTML = "<p id='noReg'>You have not created any events yet</p>";
            displayCharityEvents(user.uid);
            document.getElementById("upcomingCharity").addEventListener("click", () => {
                document.getElementById("upcomingCharity").style.backgroundColor = "#cecece";
                document.getElementById("upcomingCharity").style.border = "1px solid rgb(136, 136, 136)";
                document.getElementById("pastCharity").style.backgroundColor = "transparent";
                document.getElementById("pastCharity").style.border = "1px solid transparent";
                document.getElementById("charityMainContent").innerHTML = "<p id='noReg'>You have not created any events yet</p>";
                displayCharityEvents(user.uid);
            });
            document.getElementById("pastCharity").addEventListener("click", () => {
                document.getElementById("pastCharity").style.backgroundColor = "#cecece";
                document.getElementById("pastCharity").style.border = "1px solid rgb(136, 136, 136)";
                document.getElementById("upcomingCharity").style.backgroundColor = "transparent";
                document.getElementById("upcomingCharity").style.border = "1px solid transparent";
                document.getElementById("charityMainContent").innerHTML = "<p id='noReg'>You have no past events</p>";
                displayPastCharityEvents(user.uid);
            });
            document.getElementById("upcomingCharity").style.backgroundColor = "#cecece";
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
    db.collection("/upcomingEvents")
        .where("OrganizerID", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addEventCard(doc, "charityMainContent");
            });
            document.getElementById("loadingIndicator").style.display = "none";
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function displayPastCharityEvents(uid) {
    db.collection("/pastEvents")
        .where("OrganizerID", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addPastEventCard(doc, "charityMainContent");
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
        // FIXME: transition to DEL cloud fxn
        var dbUpdate = firebase.functions().httpsCallable('deleteDBDoc');
        dbUpdate({ path: "upcomingEvents", doc: eventID.toString() })
            .then((result) => {
                // Read result of the Cloud Function.
                if (result.data.done) {
                    console.log("Document successfully deleted!");
                    alert("Deleted Event! It may take a few minutes for the event to be fully deleted");
                    window.location = "/my-events";
                } else {
                    alert("Oh no! Something went wrong, please try again in a few minutes");
                }
            });
        // db.collection("upcomingEvents").doc(eventID).delete().then(() => {
        //     console.log("Document successfully deleted!");
        //     alert("Deleted Event! It may take a few minutes for the event to be fully deleted");
        //     window.location = "/my-events";
        // }).catch((error) => {
        //     console.error("Error removing document: ", error);
        //     alert("Oh no! Something went wrong, please try again in a few minutes");
        // });
    }
}

function addEventCard(doc, parent) {
    document.getElementById("noReg").style.display = "none";
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
    eventTemplate.querySelector(".eventClickA").href = `/event/?e=${id}&i=${blurHash}&d=${
  doc.data().ImageDim
}`;
    eventTemplate.querySelector(".eventDivImg").innerHTML = imgElement;
    eventTemplate.querySelector(".titleElement").innerHTML = title;
    eventTemplate.querySelector(".dateElement").innerHTML = dateString;
    eventTemplate.querySelector(".timeElement").innerHTML = timeString;
    eventTemplate.querySelector(".locElement").innerHTML = location;
    eventTemplate.querySelector(".orgElement").remove();
    eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
    eventTemplate.querySelector(".editEvent").href = `/my-events/edit?d=${doc.id}`;
    eventTemplate.querySelector(".deleteEvent").addEventListener("click", () => {
        deleteEvent(id);
    });
    parentList.appendChild(eventTemplate);
}

function addPastEventCard(doc, parent) {
    document.getElementById("noReg").style.display = "none";
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
    //     eventTemplate.querySelector(".eventClickA").href = `/event/?e=${id}&i=${blurHash}&d=${
    //   doc.data().ImageDim
    // }`;
    eventTemplate.querySelector(".eventDivImg").innerHTML = imgElement;
    eventTemplate.querySelector(".titleElement").innerHTML = title;
    eventTemplate.querySelector(".dateElement").innerHTML = dateString;
    eventTemplate.querySelector(".timeElement").innerHTML = timeString;
    eventTemplate.querySelector(".locElement").innerHTML = location;
    eventTemplate.querySelector(".orgElement").innerHTML = decodeURIComponent(doc.data().plusCode.toString());
    eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
    eventTemplate.querySelector(".eventActionLinksDiv").remove();
    // eventTemplate.querySelector(".deleteEvent").remove();
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
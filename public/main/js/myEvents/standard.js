console.log("standard");
document.getElementById("standardPage").style.display = "flex";
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(
    function(user) {
        if (user) {
            document.getElementById("upcomingStandard").style.backgroundColor = "#cecece";
            document.getElementById("upcomingStandard").style.border = "1px solid rgb(136, 136, 136)";
            document.getElementById("pastStandard").style.backgroundColor = "transparent";
            document.getElementById("pastStandard").style.border = "1px solid transparent";
            document.getElementById("standardMainContent").innerHTML = "<p id='noReg'>You have not registered for any events yet</p>";
            displayStandardEvents(user.uid);
            document.getElementById("upcomingStandard").addEventListener("click", () => {
                document.getElementById("upcomingStandard").style.backgroundColor = "#cecece";
                document.getElementById("upcomingStandard").style.border = "1px solid rgb(136, 136, 136)";
                document.getElementById("pastStandard").style.backgroundColor = "transparent";
                document.getElementById("pastStandard").style.border = "1px solid transparent";
                document.getElementById("standardMainContent").innerHTML = "<p id='noReg'>You have not registered for any events yet</p>";
                displayStandardEvents(user.uid);
            });
            document.getElementById("pastStandard").addEventListener("click", () => {
                document.getElementById("pastStandard").style.backgroundColor = "#cecece";
                document.getElementById("pastStandard").style.border = "1px solid rgb(136, 136, 136)";
                document.getElementById("upcomingStandard").style.backgroundColor = "transparent";
                document.getElementById("upcomingStandard").style.border = "1px solid transparent";
                document.getElementById("standardMainContent").innerHTML = "<p id='noReg'>You have no past event registrations</p>";
                displayPastEvents(user.uid);
            });
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

function displayStandardEvents(uid) {
    db.collectionGroup("registeredUsers")
        .where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((preDoc) => {
                if (preDoc.ref.parent.parent.parent.id == "upcomingEvents") {
                    var docc = preDoc.ref.parent.parent;
                    docc.get().then((doc) => {
                        addEventCard(doc, "standardMainContent");
                    });
                }

            });
            document.getElementById("loadingIndicator").style.display = "none";
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function displayPastEvents(uid) {
    db.collectionGroup("registeredUsers")
        .where("uid", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((preDoc) => {
                if (preDoc.ref.parent.parent.parent.id == "pastEvents") {
                    var docc = preDoc.ref.parent.parent;
                    docc.get().then((doc) => {
                        addPastEventCard(doc, "standardMainContent");
                    });
                }
            });
            document.getElementById("loadingIndicator").style.display = "none";
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
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
    eventTemplate.querySelector(".orgElement").innerHTML = organizer;
    eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
    eventTemplate.querySelector(".editEvent").href = `/event/refund?e=${id}&i=${blurHash}&d=${doc.data().ImageDim}`;
    eventTemplate.querySelector(".editEvent").innerHTML = `<i style="color:red;" class="fa fa-ban" aria-hidden="true"></i> Unregister`;
    eventTemplate.querySelector(".deleteEvent").remove();
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
    eventTemplate.querySelector(".eventClickA").href = `/event/?e=${id}&i=${blurHash}&d=${
doc.data().ImageDim
}`;
    eventTemplate.querySelector(".eventDivImg").innerHTML = imgElement;
    eventTemplate.querySelector(".titleElement").innerHTML = title;
    eventTemplate.querySelector(".dateElement").innerHTML = dateString;
    eventTemplate.querySelector(".timeElement").innerHTML = timeString;
    eventTemplate.querySelector(".locElement").innerHTML = location;
    eventTemplate.querySelector(".orgElement").innerHTML = organizer;
    eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
    // eventTemplate.querySelector(".editEvent").href = `/event/refund?e=${id}&i=${blurHash}&d=${doc.data().ImageDim}`;
    eventTemplate.querySelector(".eventActionLinksDiv").remove();
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
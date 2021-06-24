var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");

var parentList = document.getElementById("upcomingEvents");
// var signedInDropdown = document.getElementById("signedInDropdown");
initApp = function () {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            signInButton.style.display = "none";
            signedInDropdown.style.display = "flex";
            document.getElementById('accountButton').textContent = email;
            db.collection("upcomingEvents").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    parentList.innerHTML = parentList.innerHTML + addEventCard(doc.data().Name, doc.data().Location, doc.data().Cost, doc.data().DateTime, doc.data().ImageURL, doc.data().OrganizerName, doc.id, doc.data().MainHash);
                });
            });
        } else {
            // User is signed out.
            signInButton.style.display = "block";
            signedInDropdown.style.display = "none";
            db.collection("upcomingEvents").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    parentList.innerHTML = parentList.innerHTML + addEventCard(doc.data().Name, doc.data().Location, doc.data().Cost, doc.data().DateTime, doc.data().ImageURL, doc.data().OrganizerName, doc.id, doc.data().MainHash);
                });
            });
        }
    }, function (error) {
        console.log(error);
    });
};
window.addEventListener('load', function () {
    initApp()
});

addEventCard = function (dbtitle, dblocation, dbcost, dbdatetime, dbimageURL, dborganizer, dbid, dbhash) {
    var id = dbid.toString();
    var imageURL = dbimageURL.toString();
    var title = convertFirstCharacterToUppercase(dbtitle);
    var dateTime = new Date(dbdatetime.seconds * 1000).toString();
    var location = dblocation.toString();
    var organizer = dborganizer.toString();
    var cost = (dbcost / 100).toFixed(2).toString();
    var blurHash = encodeURI(dbhash);

    var imgElement = new String(`<img src="${imageURL}" alt="Event Brochure" width="100">`);
    var titleElement = new String(`<h2>${title}</h2>`);
    var subtextElement = new String(`<h3>${dateTime}, ${location}<h3>`);
    var otherSubtextElement = new String(`<p>By ${organizer}. $${cost}/person</p>`);
    var element = new String(`<a href="/event/?e=${id}&i=${blurHash}"><div id="${id}">${imgElement}${titleElement}${subtextElement}${otherSubtextElement}</div></a>`);
    return element;
}
const convertFirstCharacterToUppercase = (stringToConvert) => {
    var firstCharacter = stringToConvert.substring(0, 1);
    var restString = stringToConvert.substring(1);

    return firstCharacter.toUpperCase() + restString;
}
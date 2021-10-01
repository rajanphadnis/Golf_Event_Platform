var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");

var popularEventsList = document.getElementById("upcomingEvents");
initApp = function() {
    var db = firebase.firestore();
    // const searchClient = algoliasearch(
    //     "ZBTFVIYUBH",
    //     "c4853c67553536ef7c07da1e58cb9f04"
    // );
    // const search = instantsearch({
    //     indexName: "dev_eventsGolf4Bob",
    //     searchClient,
    // });
    // search.addWidgets([
    //     instantsearch.widgets.configure({
    //         hitsPerPage: 3,
    //         distinct: true,
    //         clickAnalytics: true,
    //         enablePersonalization: true,
    //       }),
    //     instantsearch.widgets.searchBox({
    //         container: "#algoliaSearch",
    //         searchAsYouType: true,
    //         cssClasses: {
    //             input: "navBarSearchBox"
    //         },
    //     }),
    //     instantsearch.widgets.hits({
    //         container: ".searchSuggestions",
    //         templates: {
    //             empty: 'No results for <q>{{ query }}</q>',
    //             item: `
    //   <p>
    //     {{ __hitIndex }}:
    //     {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
    //   </p>
    // `,
    //         },
    //     }),
    // ]);

    // search.start();
    document.getElementById("algoliaSearch").addEventListener("focusin", function() {
        document.querySelector(".searchSuggestions").style.display = "block";
    });
    document.getElementById("algoliaSearch").addEventListener("focusout", function() {
        document.querySelector(".searchSuggestions").style.display = "none";
    });
    firebase.auth().onAuthStateChanged(
        function(user) {
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
                                    .orderBy("visits", "desc")
                                    .limit(10)
                                    .get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            addEventCard(doc, "popularEvents");
                                        });
                                    });
                                db.collection("upcomingEvents")
                                    .orderBy("DateTime")
                                    .limit(10)
                                    .get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            addEventCard(doc, "upcomingEvents");
                                        });
                                    });
                                db.collection("upcomingEvents")
                                    .orderBy("adScale", "desc")
                                    .orderBy("visits", "desc")
                                    .limit(10)
                                    .get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            addEventCard(doc, "recEvents");
                                        });
                                    });
                            } else {
                                window.location = "/my-events";
                            }
                        } else {
                            window.location = "/onboarding";
                        }
                    });
            } else {
                // User is signed out.
                window.location = "/landing";
            }
        },
        function(error) {
            console.log(error);
        }
    );
};
window.addEventListener("load", function() {
    initApp();
});

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
    eventTemplate.querySelector("a").href = `/event/?e=${id}&i=${blurHash}&d=${
    doc.data().ImageDim
  }`;
    eventTemplate.querySelector(".eventDivImg").innerHTML = imgElement;
    eventTemplate.querySelector(".titleElement").innerHTML = title;
    eventTemplate.querySelector(".dateElement").innerHTML = dateString;
    eventTemplate.querySelector(".timeElement").innerHTML = timeString;
    eventTemplate.querySelector(".locElement").innerHTML = location;
    eventTemplate.querySelector(".orgElement").innerHTML = organizer;
    eventTemplate.querySelector(".costElement").innerHTML = `$${cost}/person`;
    parentList.appendChild(eventTemplate);
}

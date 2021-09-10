const uri = window.location.search;
var queryString;
try {
    console.log(uri);
    queryString = decodeURI(uri);
} catch (e) {
    // catches a malformed URI
    console.error(e);
    queryString = uri;
}
var searchParams = new URLSearchParams(queryString);
var eventID;
if (searchParams.has("d")) {
    eventID = searchParams.get("d").toString();
    if (eventID == "") {
        window.location = "/";
    }
} else {
    window.location = "/";
}

// var signInButton = document.getElementById("signInButton");
// var signedInDropdown = document.getElementById("signedInDropdown");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData;
var loading = false;
var imgDim;
var initApp = function() {
    // var ihash;
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(
        function(user) {
            if (user) {
                var email = user.email;
                db.collection("users")
                    .doc(user.uid)
                    .get()
                    .then((doc) => {
                        if (doc.exists && doc.data().accountType == "charity") {
                            db.collection("upcomingEvents")
                                .doc(eventID)
                                .get()
                                .then((eDoc) => {
                                    if (eDoc.exists) {
                                        var date = new Date(eDoc.data().DateTime.seconds * 1000);
                                        var day = date.getDate(),
                                            month = date.getMonth() + 1,
                                            year = date.getFullYear(),
                                            hour = date.getHours(),
                                            min = date.getMinutes();

                                        month = (month < 10 ? "0" : "") + month;
                                        day = (day < 10 ? "0" : "") + day;
                                        hour = (hour < 10 ? "0" : "") + hour;
                                        min = (min < 10 ? "0" : "") + min;

                                        var today =
                                            year + "-" + month + "-" + day + "T" + hour + ":" + min;
                                        tinymce
                                            .get("htmeditor")
                                            .setContent(eDoc.data().Blurb.toString());
                                        document.getElementById("title").value = eDoc.data().Name;
                                        document.getElementById("location").value =
                                            eDoc.data().Location;
                                        document.getElementById("dt").value = today;
                                        document.getElementById("cost").value = parseInt(
                                            eDoc.data().Cost
                                        );
                                        document.getElementById("maxParticipants").value = parseInt(
                                            eDoc.data().MaxParticipants
                                        );
                                        document.getElementById("plusCode").value = decodeURIComponent(eDoc.data().plusCode);
                                        var files = [];
                                        document
                                            .getElementById("files")
                                            .addEventListener("change", function(e) {
                                                document.getElementById("loadingFile").style.display =
                                                    "block";
                                                loading = true;
                                                files = e.target.files;
                                                if (files.length != 0) {
                                                    var fr = new FileReader();
                                                    fr.onload = () => showImage(fr);
                                                    fr.readAsDataURL(files[0]);
                                                } else {
                                                    document.getElementById("loadingFile").style.display =
                                                        "none";
                                                    loading = false;
                                                }

                                                function showImage(fileReader) {
                                                    var img = document.getElementById("preIMG");
                                                    img.onload = () => getImageData(img);
                                                    img.src = fileReader.result;
                                                }

                                                function getImageData(img) {
                                                    ctx.drawImage(img, 0, 0);
                                                    imageData = ctx.getImageData(
                                                        0,
                                                        0,
                                                        img.width,
                                                        img.height
                                                    ).data;
                                                    console.log("image data:", imageData);
                                                    imgDim = img.height / img.width;
                                                    document.getElementById("loadingFile").style.display =
                                                        "none";
                                                    loading = false;
                                                }
                                            });
                                        document
                                            .getElementById("send")
                                            .addEventListener("click", function() {
                                                var blurb = tinymce.get("htmeditor").getContent();
                                                var title = document.getElementById("title").value;
                                                var loc = document.getElementById("location").value;
                                                var dt = document.getElementById("dt").value;
                                                var cost = document.getElementById("cost").value;
                                                var max =
                                                    document.getElementById("maxParticipants").value;
                                                    var plusCode = encodeURIComponent(
                                                        document.getElementById("plusCode").value.toString());
                                                //   console.log(blurb);
                                                //   console.log(title);
                                                //   console.log(loc);
                                                //   console.log(Date(dt));
                                                //   console.log(cost);
                                                // console.log(ihash);
                                                if (files.length != 0) {
                                                    if (loading == false) {
                                                        addEvent(
                                                            eDoc.id,
                                                            title,
                                                            loc,
                                                            dt,
                                                            cost,
                                                            max,
                                                            blurb,
                                                            files[0],
                                                            user.uid,
                                                            doc.data().name,
                                                            imgDim,
                                                            plusCode
                                                            // ihash
                                                        );
                                                    } else {
                                                        alert(
                                                            "Please wait for the image to finish loading, then try again."
                                                        );
                                                    }
                                                } else {
                                                    alert("No file chosen");
                                                }
                                            });
                                    } else {
                                        window.location = "/my-events";
                                    }
                                });
                        } else {
                            window.location = "/my-events";
                        }
                    });
            } else {
                // User is signed out.
                window.location = "/sign-in?l=my-events%2Fnew-event%2F";
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
    dim,
    plusCode
) {
    var uploadEventData1 = firebase.functions().httpsCallable('uploadEventData1');
    uploadEventData1({
        dID: did,
        Name: title,
        MaxParticipants: parseInt(max),
        Blurb: blurb.toString(),
        Cost: parseInt(cost),
        DateTime: dt.toString(),
        Location: loc.toString(),
        OrganizerID: uid.toString(),
        OrganizerName: charityName.toString(),
        ImageDim: parseFloat(dim),
        plusCode: plusCode,
        stripeOrgID: null,
    }).then((result) => {
        if (result.data.done) {
            console.log("Document written with ID: ", result.data.did);
            uploadFile(poster, result.data.did);
            // window.location = `/event/?e=${encodeURIComponent(dID)}&i=${encodeURIComponent(hash)}&d=${encodeURIComponent(hDim)}`;
        } else {
            alert("Whoops, something went wrong. Try again in a few moment - or contact support if the issue persists.");
        }
    });
    // TODO: transition to NEW1 cloud function
    // firebase
    //     .firestore()
    //     .collection("upcomingEvents")
    //     .doc(did)
    //     .set({
    //         Name: title,
    //         MaxParticipants: parseInt(max),
    //         Blurb: blurb.toString(),
    //         Cost: parseInt(cost),
    //         DateTime: new Date(Date.parse(dt)),
    //         Location: loc.toString(),
    //         LastUpdated: new Date(Date.now()),
    //         OrganizerID: uid.toString(),
    //         OrganizerName: charityName.toString(),
    //         ImageDim: parseFloat(dim),
    //         // MainHash: hash.toString(),
    //     }, { merge: true })
    //     .then((docRef) => {
    //         console.log("Document written with ID: ", did);
    //         uploadFile(poster, did);
    //     })
    //     .catch((error) => {
    //         console.error("Error adding document: ", error);
    //     });
}

function uploadFile(file, name) {
    var storage = firebase
        .app()
        .storage("gs://golf-event-platform")
        .ref(name + ".jpg");

    //upload file
    var upload = storage.put(file);
    console.log("utting");

    //update progress bar
    upload.on(
        "state_changed",
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
            document.getElementById("progress").value = percentage;
        },

        function error() {
            alert("error uploading file");
        },

        function complete() {
            document.getElementById(
                "uploading"
            ).innerHTML += `${file.name} uploaded <br/>`;
            getDownloadURLOfImg(name);
        }
    );
}

function getDownloadURLOfImg(docID) {
    firebase
        .app()
        .storage("gs://golf-event-platform")
        .ref(docID + ".jpg")
        .getDownloadURL()
        .then((url) => {
            document.getElementById("progress").value += 25;
            var uploadEventData2 = firebase.functions().httpsCallable('uploadEventData2');
            uploadEventData2({
                dID: docID,
                ImageURL: url,
            }).then((result) => {
                if (result.data.done) {
                    document.getElementById("progress").value = 100;
                    alert("event added");
                    window.location = "/my-events";
                } else {
                    alert("Whoops, something went wrong. Try again in a few moment - or contact support if the issue persists.");
                }
            });
            // TODO: transition to NEW2 cloud function
            // firebase
            //     .firestore()
            //     .collection("upcomingEvents")
            //     .doc(docID)
            //     .set({
            //         ImageURL: url,
            //     }, { merge: true })
            //     .then((t) => {
            //         return new Promise(async(resolve, reject) => {
            //             document.getElementById("progress").value = 100;
            //             resolve(true);
            //         });
            //     })
            //     .then((t) => {
            //         alert("event added");
            //         window.location = "/my-events";
            //     });
        })
        .catch((error) => {
            // Handle any errors
            console.log(error);
        });
}
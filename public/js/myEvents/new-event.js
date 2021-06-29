var signInButton = document.getElementById("signInButton");
var signedInDropdown = document.getElementById("signedInDropdown");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData;
var loading = false;
var imgDim;
var initApp = function () {
  // var ihash;
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var email = user.email;
        db.collection("charities")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              var files = [];
              document
                .getElementById("files")
                .addEventListener("change", function (e) {
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
                    // ihash = blurhash.encode(
                    //   imageData,
                    //   img.width,
                    //   img.height,
                    //   4,
                    //   3
                    // );
                    // console.log(ihash);
                    document.getElementById("loadingFile").style.display =
                      "none";
                    loading = false;
                  }
                });
              document
                .getElementById("send")
                .addEventListener("click", function () {
                  var blurb = tinymce.get("htmeditor").getContent();
                  var title = document.getElementById("title").value;
                  var loc = document.getElementById("location").value;
                  var dt = document.getElementById("dt").value;
                  var cost = document.getElementById("cost").value;
                  var max = document.getElementById("maxParticipants").value;
                  //   console.log(blurb);
                  //   console.log(title);
                  //   console.log(loc);
                  //   console.log(Date(dt));
                  //   console.log(cost);
                  // console.log(ihash);
                  if (files.length != 0) {
                    if (loading == false) {
                      addEvent(
                        title,
                        loc,
                        dt,
                        cost,
                        max,
                        blurb,
                        files[0],
                        user.uid,
                        doc.data().name,
                        imgDim
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
        // User is signed out.
        window.location = "/sign-in?l=my-events%2Fnew-event%2F";
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

function addEvent(
  title,
  loc,
  dt,
  cost,
  max,
  blurb,
  poster,
  uid,
  charityName,
  dim
  // hash
) {
  console.log(hash);
  firebase
    .firestore()
    .collection("upcomingEvents")
    .add({
      Name: title,
      MaxParticipants: parseInt(max),
      Blurb: blurb.toString(),
      Cost: parseInt(cost),
      DateTime: new Date(Date.parse(dt)),
      Location: loc.toString(),
      LastUpdated: new Date(Date.now()),
      OrganizerID: uid.toString(),
      OrganizerName: charityName.toString(),
      ImageDim: parseFloat(dim),
      // MainHash: hash.toString(),
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      uploadFile(poster, docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
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
      firebase
        .firestore()
        .collection("upcomingEvents")
        .doc(docID)
        .set(
          {
            ImageURL: url,
          },
          { merge: true }
        )
        .then((t) => {
          return new Promise(async (resolve, reject) => {
            document.getElementById("progress").value = 100;
            resolve(true);
          });
        })
        .then((t) => {
          alert("event added");
        });
    })
    .catch((error) => {
      // Handle any errors
    });
}

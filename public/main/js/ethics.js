initApp = function() {
    var db = firebase.firestore();
    db.collection("admin").doc("generalPageInfo").get().then((doc) => {
        document.querySelector("body").innerHTML = doc.data().ethics;
    });
};
window.addEventListener("load", function() {
    initApp();
});

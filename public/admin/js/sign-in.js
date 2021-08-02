initApp = function () {
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
      } else {
        var uiConfig = {
          signInSuccessUrl: `/`,
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
          ],
          tosUrl: "https://www.google.com",
          privacyPolicyUrl: function () {
            window.location.assign("https://www.google.com");
          },
        };
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start("#firebaseui-auth-container", uiConfig);
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

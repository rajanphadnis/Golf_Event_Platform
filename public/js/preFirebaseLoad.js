// CSS Vars in JS:
var navBarLinkPaddingLeftRight = "14px";
var navBarLinkPaddingTopBottom = "10px";

// When the user scrolls the page, execute myFunction
window.onscroll = function () { stickyScroll() };

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickyScroll() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

//Mobile Search Button handler
var searchbutton = document.getElementById("mobileSearchButton");
var logo = document.getElementById("navBarLogoA");
var signInButton = document.getElementById("signInButton");
var createEventButton = document.getElementById("createButton")
var searchbox = document.getElementById("search-container");
var searchBoxNavBar = document.getElementById("leftNav");
var backButton = document.getElementById("mobileExitSearchButton");
searchbutton.addEventListener("click", function () {
  logo.style.display = "none";
  signInButton.style.display = "none";
  createEventButton.style.display = "none";
  searchbox.style.display = "block";
  searchbox.style.width = "90%";
  searchbox.style.paddingLeft = "0px";
  searchbutton.style.display = "none";
  searchBoxNavBar.style.width = "100%";
  searchBoxNavBar.style.paddingTop = navBarLinkPaddingTopBottom;
  searchBoxNavBar.style.paddingBottom = navBarLinkPaddingTopBottom;
  backButton.style.display = "block";
});
backButton.addEventListener("click", function() {
  logo.style.display = null;
  signInButton.style.display = null;
  createEventButton.style.display = null;
  searchbox.style.display = null;
  searchbox.style.width = null;
  searchbox.style.paddingLeft = null;
  searchbutton.style.display = null;
  searchBoxNavBar.style.width = null;
  searchBoxNavBar.style.paddingTop = null;
  searchBoxNavBar.style.paddingBottom = null;
  backButton.style.display = null;
});
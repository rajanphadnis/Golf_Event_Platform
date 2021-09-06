var hash = location.hash;
switch (hash) {
    case "#about":
        document.getElementById("MainContent").innerHTML = "";
        document.getElementById("MainContent").appendChild(document.importNode(
            document.getElementById("about").content,
            true
        ));
        break;
    case "#pricing":
        document.getElementById("MainContent").innerHTML = "";
        document.getElementById("MainContent").appendChild(document.importNode(
            document.getElementById("pricing").content,
            true
        ));
        break;
    case "#faq":
        document.getElementById("MainContent").innerHTML = "";
        document.getElementById("MainContent").appendChild(document.importNode(
            document.getElementById("faq").content,
            true
        ));
        break;
    default:
        document.getElementById("MainContent").innerHTML = "";
        document.getElementById("MainContent").appendChild(document.importNode(
            document.getElementById("home").content,
            true
        ));
        break;
}
window.addEventListener('hashchange', function(e) {
    var hash = location.hash;
    switch (hash) {
        case "#about":
            document.getElementById("MainContent").innerHTML = "";
            document.getElementById("MainContent").appendChild(document.importNode(
                document.getElementById("about").content,
                true
            ));
            break;
        case "#pricing":
            document.getElementById("MainContent").innerHTML = "";
            document.getElementById("MainContent").appendChild(document.importNode(
                document.getElementById("pricing").content,
                true
            ));
            break;
        case "#faq":
            document.getElementById("MainContent").innerHTML = "";
            document.getElementById("MainContent").appendChild(document.importNode(
                document.getElementById("faq").content,
                true
            ));
            break;
        default:
            document.getElementById("MainContent").innerHTML = "";
            document.getElementById("MainContent").appendChild(document.importNode(
                document.getElementById("home").content,
                true
            ));
            break;
    }
});
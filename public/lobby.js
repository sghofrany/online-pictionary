window.addEventListener("load", () => {

    // var socket = io.connect("http://localhost:4000");

    /**
     * Allow users to set their name here and add it to local storage
     */

    var room = makeid(10);

    window.localStorage.setItem("name", "Anonymous");

    document.getElementById("lobby-url").href = "./index.html?r=" + room;
    document.getElementById("lobby-url").innerHTML = "Click here to join a new lobby!";
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
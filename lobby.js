window.addEventListener("load", () => {

    // var socket = io.connect("http://localhost:4000");

    var room = makeid(10);

    document.write("<a href='./index.html?r=" + room + "'>Click to join</a>");

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
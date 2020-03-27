/**
 * This class handles the connection of a new user
 */

window.addEventListener("load", () => {

    var query = window.location.search;
    var params = new URLSearchParams(query);
    var room = params.get('r');

    /**
     * Set the value of room in local storage
     */
     window.localStorage.setItem("r", room);
    

     /**
      * Get name from local storage
      */

    var name = window.localStorage.getItem("name");

    if(typeof name === "undefined") {
        name = "Anon-" + (Math.floor(Math.random() * 500) + 1);
    }

    /**
     * the "login" event recieves the socket.id from the server and then it emits its
     * own event called "add-user".
     * 
     * "add-user" will then send the "socket.id" along with the "room" and the "name" to the 
     * server so that it can create a User object for this specific user.
     */

    socket.on("login", (data) => {
        socket.emit("add-user", ({
            id: data.id,
            name: name,
            room: room
        }))
    })

    document.getElementById("room-id").innerHTML = `Room: ${room}`;

    socket.on("room-counter", (data) => {
        console.log(data);
        document.getElementById("room-counter").innerHTML = `Counter: ${data.timer}`;
    })
})

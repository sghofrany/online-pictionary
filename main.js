window.addEventListener("load", () => {

    var query = window.location.search;
    var params = new URLSearchParams(query);
    var room = params.get('r');

    const user = {
        id: "",
        name: "",
        room: "",
        loaded: false
    }
    
    socket.on("login", (data) => {
    
        var id = data.id;
        var name = "Shayan-" + (Math.floor(Math.random() * 100) + 1);
    
        socket.emit("add-user", ({
            id:id,
            name: name,
            room: room
        }))
    
    })
    
    // socket.on("add-user", (data) => {
    
    //     user.id = data.id;
    //     user.name = data.name;
    //     user.room = data.room;
    //     user.loaded = data.loaded;
        
    //     console.log("[Data]", user);

       
    //     console.log(user.id, user.room);
    // })
    
    socket.on("add-user", (data) => {
        document.getElementById("room-id").innerHTML = `Room: ${data.u.room}`;
        window.localStorage.setItem("r", data.u.room);
    })
})

window.addEventListener("load", () => {

    // var socket = io.connect("http://localhost:4000");
    // var socket = io.connect();

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

    socket.on("testing-room", (data) => {
        console.log(data);
    })
    
    socket.on("add-user", (data) => {
    
        user.id = data.id;
        user.name = data.name;
        user.room = data.room;
        user.loaded = data.loaded;
        
        console.log(user.id, user.room);
    })
    
    
})

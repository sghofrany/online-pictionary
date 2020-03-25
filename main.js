window.addEventListener("load", () => {

    var socket = io.connect("http://63875965.ngrok.io");

    const user = {
        id: "",
        name: "",
        color: "",
        x: -1,
        y: -1,
        loaded: false
    }
    
    socket.on("login", (data) => {
    
        var id = data.id;
        var name = "Shayan-" + (Math.floor(Math.random() * 100) + 1);
    
        socket.emit("add-user", ({
            id:id,
            name: name
        }))
    
    })
    
    socket.on("add-user", (data) => {
    
        user.id = data.id;
        user.name = data.name;
        user.color = data.color;
        user.x = data.x;
        user.y = 0;
        user.loaded = data.loaded;
        
        console.log(user.loaded, user.id);
    })
    
    
})

window.addEventListener("load", () => {

    // var socket = io.connect("http://579563fd.ngrok.io");
    var socket = io.connect();

    const user = {
        id: "",
        name: "",
        color: "",
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

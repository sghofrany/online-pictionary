const UUID = require('uuidjs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

const colors = ["black", "blue", "red", "green", "gray", "pink", "purple"];
const users = [];

const user = {
    id: "",
    name: "",
    color: "",
    x: -1,
    y: -1,
    loaded: false
}

// app.get('/', function (req, res) {
//     res.sendfile(__dirname + '/index.html');
// });

io.on("connection", (socket) => {
    // socket.emit("login", {
    //     id: socket.id
    // });

    io.to(socket.id).emit("login", {
        id: socket.id
    })

    socket.on("add-user", (data) => {
        var u = Object.create(user);
        u.id = data.id;
        u.name = data.name;
        u.color = colors[Math.floor(Math.random() * colors.length)];
        u.x = users.length * 100;
        u.y = data.y;
        u.loaded = true;

        users.push(u);

        io.to(u.id).emit("add-user", u); //emits data back to all of the other sockets
    
    });

    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", {
            x: data.x,
            y: data.y
        });
        
    })

});




http.listen(4000, () => console.log("Server running"));
const UUID = require('uuidjs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

const users = [];
const drawings = [];

const draw = {
    x: 0,
    y: 0,
    color: ""
}

const user = {
    id: "",
    name: "",
    color: "",
    x: -1,
    y: -1,
    loaded: false
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/draw.js', function (req, res) {
    res.sendFile(__dirname + '/draw.js');
});

app.get('/main.js', function (req, res) {
    res.sendFile(__dirname + '/main.js');
});

io.on("connection", (socket) => {


    io.to(socket.id).emit("login", {
        id: socket.id,
        drawings: drawings
    })

    socket.on("add-user", (data) => {
        var u = Object.create(user);
        u.id = data.id;
        u.name = data.name;
        u.color = "red";
        u.x = users.length * 100;
        u.y = data.y;
        u.loaded = true;

        users.push(u);

        io.to(u.id).emit("add-user", u); //emits data back to all of the other sockets
    
    });

    socket.on("draw", (data) => {
        var d = Object.create(draw);
        d.x = data.x;
        d.y = data.y;
        d.color = data.color;

        drawings.push(d);

        socket.broadcast.emit("draw", {
            x: data.x,
            y: data.y,
            color: data.color
        });
        
    })

});




http.listen(4000, () => console.log("Server running"));
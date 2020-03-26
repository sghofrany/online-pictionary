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
    color: "",
    room : ""
}

const user = {
    id: "",
    name: "",
    room: "",
    loaded: false
}

app.get('/create.html', function (req, res) {
    res.sendFile(__dirname + '/create.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/init.js', function (req, res) {
    res.sendFile(__dirname + '/init.js');
});

app.get('/draw.js', function (req, res) {
    res.sendFile(__dirname + '/draw.js');
});

app.get('/main.js', function (req, res) {
    res.sendFile(__dirname + '/main.js');
});

app.get('/lobby.js', function (req, res) {
    res.sendFile(__dirname + '/lobby.js');
});


io.on("connection", (socket) => {
    
    console.log("-----");
    Object.keys(io.sockets.sockets).forEach(function(id) {
        console.log("ID:", id)  // socketId
    })
    
    socket.on("disconnect", () => {
       console.log(`[Disconnted] ${socket.id}`);

    })

    io.to(socket.id).emit("login", {
        id: socket.id
    })

    socket.on("add-user", (data) => { // this is called when user joins a room
        var u = Object.create(user);
        u.id = data.id;
        u.name = data.name;
        u.room = data.room;
        u.loaded = true;

        users.push(u);

        socket.join(u.room);

        io.to(u.id).emit("add-user", { //emits data back to the user with that id
            u: u,
            drawings: drawings
        }); 
       
        io.to(u.room).emit("testing-room", {
            message: `Welcome to ${u.name} to room ${u.room}`
        })
    });

    socket.on("draw", (data) => {
        var d = Object.create(draw);
        d.x = data.x;
        d.y = data.y;
        d.color = data.color;

        var u = getUserById(socket.id).user;

        d.room = u.room;

        drawings.push(d);

        socket.to(u.room).emit("draw", {  //emit drawing to certain room
            x: data.x,
            y: data.y,
            color: data.color
        });
        
    })

});


function getUserById(id) {
    // console.log(users.length);
    for(var i = 0; i < users.length; i++) {
        // console.log("loop", users[i].id, id);
        if(users[i].id == id) {
            return {
                user: users[i],
                position: i
            }
        }
    }
}

http.listen(4000, () => console.log("Server running"));
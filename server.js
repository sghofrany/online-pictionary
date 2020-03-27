const UUID = require('uuidjs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const {User} = require("./objects/User");
const {Game} = require("./objects/Game");
const {Drawing} = require("./objects/Drawing");

const games = [];

const userMap = new Map();


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
    

    socket.on("disconnect", () => {
 
        /**
         * Handling user disconnect
         */

        for(var i = 0; i < games.length; i++) {
           
              
            /**
             * Remove users from Game on disconnect
             */

            var dUser = games[i].getUser(socket.id);


           if(typeof dUser !== 'undefined') {
                games[i].users.splice(dUser.pos, 1);

                /**
                 * if the number of users in a Game is 0, then remove
                 * the game from the games array.
                 */

                if(games[i].users.length === 0) { 
                    games.splice(i, 1);
                }
           } 
       }

    })

    io.to(socket.id).emit("login", {
        id: socket.id
    })

    socket.on("add-user", (data) => {

        var user = new User(data.id, data.name, data.room);

        socket.join(user.room);

        var roomCount = io.sockets.adapter.rooms[user.room].length;
       
        /**
         * If the number of people in the room is one when someone joins a new Game needs to be created.
         * This is because socket.io will create a room for you if it doesn't exist already.
         */

        if(roomCount === 1) {
            var g = new Game(io, user.room, 0, 0, 3, "hello", user.id);
            games.push(g);
            g.startTimer();
        }

        userMap.set(user.id, user);

        console.log(getUserById(user.id));

        var game = getGameByRoom(user.room)
        game.users.push(user);

        /**
         * This will be used for messaging in rooms
         */

        io.to(user.id).emit("draw-current", {
            drawings: game.drawings
        })

        io.to(user.room).emit("message-room", {
            message: `Welcome to ${user.name} to room ${user.room}`
        })
    })

    socket.on("draw", (data) => {

        var room = getUserById(data.id).room;

        if(typeof room === "undefined") return;

        var drawing = new Drawing(data.x, data.y, data.color, room);
        
        var game = getGameByRoom(room);

        if(typeof game === "undefined") return;

        game.drawings.push(drawing);

        /**
         * Send the "draw" information only to the room that it's supposed to go to
         */

        socket.to(room).emit("draw", { 
            x: data.x,
            y: data.y,
            color: data.color
        });
        
    })

});


function getUserById(id) {
    return userMap.get(id);
}

function getGameByRoom(room) {
    for(var i = 0; i < games.length; i++) {
        var g = games[i];

        if(g.room === room) {
            return g;
        }
    }
}

http.listen(4000, () => console.log("Server running on port", 4000));
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
const words = require("./objects/words");

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

            var game = games[i];

            var user = game.getUser(socket.id);


           if(typeof user !== 'undefined') {
                
                game.users.splice(user.pos, 1);

                /**
                 * if the number of users in a Game is 0, then remove
                 * the game from the games array.
                 */

                if(game.users.length === 0) { 
                    games.splice(i, 1);
                    return;
                }

                if(game.users.length >= 2) {
                    game.endRound();
                    return;
                }
                
                if(game.users.length === 1) {
                    game.timer = 0;
                    return;
                }

           } 
       }

    })

    io.to(socket.id).emit("login", {
        id: socket.id
    })

    socket.on("add-user", (data) => {

        var user = new User(data.id, data.name, data.room);

        if(user.name.length > 12) {
            user.name = user.name.substring(0, 12);
        }

        console.log(`[Connect] ${user.name}|${user.id} joined.`);

        socket.join(user.room);

        var roomCount = io.sockets.adapter.rooms[user.room].length;
       
        /**
         * If the number of people in the room is one when someone joins a new Game needs to be created.
         * This is because socket.io will create a room for you if it doesn't exist already.
         */

        if(roomCount === 1) {
            var g = new Game(io, user.room, -1, 0, 3, words.easyWords());
            games.push(g);
        }

        userMap.set(user.id, user);

        var game = getGameByRoom(user.room);
        game.users.push(user);

        if(game.users.length >= 2) {
            if(game.timer === -1) {
                game.start();
                console.log("[SERVER] Game has been started.");
                console.log(`[SERVER] DRAWER:${game.drawer.id}, WORD:${game.currentWord}, ROUND:${game.currentRound}/${game.totalRounds}`);
                return;
            }
        }

        console.log("GAME", game.ending);

        /**
         * This will be used for messaging in rooms
         */

        io.to(user.id).emit("draw-current", {
            drawings: game.drawings
        })

    })

    socket.on("message-room", (data) => {

        var user = userMap.get(socket.id);
        var game = getGameByRoom(user.room);

        /**
         * User has guessed, stop them from messaging
         */

        if(user.guessed) { 
            return;
        }

        var checked = game.check(user.id, data.message);

        io.to(user.room).emit("message-room", {
            message: checked
        })
    })

    socket.on("draw", (data) => {

        var room = getUserById(data.id).room;

        if(typeof room === "undefined") return;

        var drawing = new Drawing(data.x, data.y, data.color, room);
        
        var game = getGameByRoom(room);

        if(typeof game === "undefined") return;

        /**
         * Only draw when its your turn
         */

        if(typeof game.drawer !== "undefined" && game.drawer.id !== socket.id) return;

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
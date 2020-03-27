const {User} = require("./user");

class Game { 
    constructor(io, room, timer, currentRound, totalRounds, currentWord, drawer) {
        this.io = io;
        this.room = room;
        this.timer = timer;
        this.currentRound = currentRound;
        this.totalRounds = totalRounds;
        this.currentWord = currentWord;
        this.drawer = drawer;
        this.users = [];
        this.drawings = [];
    }

    getUser(id) {
        for(var i = 0; i < this.users.length; i++) {
            if(this.users[i].id === id) {
                return {
                    user: this.users[i],
                    pos: i
                }
            }
        }
    }

    startTimer() {
        var t = setInterval(() => {
            this.timer++;
            if(this.timer === 20) {
                clearInterval(t);
            }

            this.io.to(this.room).emit("room-counter", {
                timer: this.timer
            });
            // console.log(`Room ${this.room} timer ${this.timer}`);
        }, 1000);

    }
}


module.exports = {
    Game
}
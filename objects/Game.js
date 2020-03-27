class Game { 
    constructor(io, room, timer, currentRound, totalRounds, wordArray) {
        this.io = io;
        this.room = room;
        this.timer = timer;
        this.currentRound = currentRound;
        this.totalRounds = totalRounds;
        this.currentWord = "";
        this.drawer = undefined;
        this.wordArray = wordArray;
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
            
            this.timer--;
            
            /**
             * Time has run out, start a new round.
             */
            
            if(this.timer === 0) {
                clearInterval(t);
                this.nextRound();
            }

            /**
             * No more users in the room, end the game and stop the timer.
             */

            if(this.users.length === 0) {
                clearInterval(t);
                this.end();
            }

            this.io.to(this.room).emit("room-counter", {
                timer: this.timer
            });
        }, 1000);

    }

    start() {
        /**
         * Set the first drawer as the first person who joined
         */
        this.drawer = this.users[0];

        /**
         * Since we set the currentRound to 0 when we start the game, we need
         * to increment the currentRound by 1.
         */

        this.currentRound++; 
        
        /**
         * Choose a random word from our array and then remove it so that later 
         * on we don't choose the same word twice.
         */

        var wordPos = Math.floor(Math.random() * this.wordArray.length);

        this.currentWord = this.wordArray[wordPos];
        this.wordArray.splice(wordPos, 1);

        this.startTimer();
    }

    nextRound() {

        this.currentRound++;
        this.drawings = [];

        if(this.currentRound > this.totalRounds) {
            this.end();
        }

        var wordPos = Math.floor(Math.random() * this.wordArray.length);

        this.currentWord = this.wordArray[wordPos];
        this.wordArray.splice(wordPos, 1);

        this.startTimer();

    }

    check(id, word) {
        var user = this.getUser(id).user;
        /**
         * User doesn't exist
         */

        if(typeof user === "undefined") {
            return false;
        }

        /**
         * Game hasn't started yet
         */

        if(this.currentRound === 0) {
            return false;
        }
        /**
         * User has already guessed
         */

        if(user.guessed) {
            return false;
        }

        if(word.toLowerCase() === this.currentWord.toLowerCase()) {
            user.guessed = true;
            console.log(user.id, user.guessed);
            return true;
        }

        console.log(user.id, user.guessed);
        return false;
    }

    end() {

    }

    toString() {
        console.log(`[${this.currentRound}/${this.totalRounds}] Current word is ${this.currentWord}, Drawer is ${this.drawer.id}, Room is ${this.room}`);
    }

}


module.exports = {
    Game
}
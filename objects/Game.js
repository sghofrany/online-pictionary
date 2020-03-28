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
        this.allWords = wordArray;
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
            
            if(this.timer <= 0) {
               
                if(this.currentRound >= this.totalRounds) {
                    clearInterval(t);
                    this.end();
                    return;
                }
                
                console.log("[Server] The time ran out, starting next round.");
                
                this.nextRound();
                return;
            }

            /**
             * No more users in the room, end the game and stop the timer.
             */

            if(this.users.length <= 1) {
                clearInterval(t);
                this.end();
                return;
            }

            this.io.to(this.room).emit("room-counter", {
                timer: this.timer
            });

            console.log(this.timer);
        }, 1000);

    }

    start() {
        /**
         * Set the first drawer as the first person who joined
         */
        this.timer = 30;
        this.drawer = this.users[0];

        /**
         * Since we set the currentRound to 0 when we start the game, we need
         * to increment the currentRound by 1.
         */

        this.currentRound = 0;
        this.currentRound++; 
        
        /**
         * Choose a random word from our array and then remove it so that later 
         * on we don't choose the same word twice.
         */
        
         this.wordArray = this.allWords;
        var wordPos = Math.floor(Math.random() * this.wordArray.length);

        this.currentWord = this.wordArray[wordPos];
        this.wordArray.splice(wordPos, 1);

        this.startTimer();
    }

    nextRound() {

        this.timer = 30;
        this.currentRound++;
        this.drawings = [];

        /**
         * Set every users "guessed" back to false for the new round.
         */

        for(var i = 0; i < this.users.length; i++) {
            this.users[i].guessed = false;
        }


        /**
         * End the game if not enough people are in the new round.
         */

        if(this.users.length <= 1) {
            this.end();
            return;
        }


        /**
         * If at the end of the users array, set the new user to the begining
         * else just select the next person.
         */

        var currDrawer = this.getUser(this.drawer.id);
        var newDrawer;

        if(currDrawer.pos === (this.users.length - 1)) {
            newDrawer = this.users[0];
        } else {
            newDrawer = this.users[currDrawer.pos + 1];
        }

        this.drawer = newDrawer;

        console.log(`[SERVER] Old:${currDrawer.user.id} New:${newDrawer.id}`);

        /**
         * Pick new word
         */

        var wordPos = Math.floor(Math.random() * this.wordArray.length);

        this.currentWord = this.wordArray[wordPos];
        this.wordArray.splice(wordPos, 1);
        
        console.log(`[SERVER] Round ${this.currentRound} of ${this.totalRounds} has started WORD:${this.currentWord}`);

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
            
            if(this.endRound()) {
              
                this.timer = 0;

                return true;
            }

            return true;
        }

        return false;
    }

    endRound() {

        for(var i = 0; i < this.users.length; i++) {

            /**
             * if user[i]. guessed == false and user[i] is not the drawer return false
             */

            if(!this.users[i].guessed && this.users[i].id !== this.drawer.id) {
                return false;
            }
        }

        return true;
    }

    end() {

        if(this.users.length == 0) {
            console.log("[SERVER] Game has ended, not enough players.");
            return;
        }

        this.timer = 30;

        console.log("[SERVER] Game has ended, starting an new game in 30 seconds.");

        var t = setInterval(() => {
            
            this.timer--;
            
            if(this.timer === 0) {
                clearInterval(t);

                if(this.users.length === 1) {
                    console.log("[SERVER] Not enough players to start a game, restarting timer.");
                    this.timer = 30;
                    return;
                }

                this.start();
                return;
            }

        }, 1000);


    }

}

module.exports = {
    Game
}
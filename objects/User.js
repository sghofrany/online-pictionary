class User {
    constructor(id, name, room) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.guessed = false;
    }
}

module.exports = {
    User
}
const mysql = require('mysql2/promise');
const connection = require('../config/database').connection

class User {
    constructor(username, hash, salt) {
        //this.user_id = user_id;
        this.username = username;
        this.hash = hash;
        this.salt = salt;
    }

    static findOne(username) {
        //console.log(username + " from line 25 database.js")
        return connection.execute(
            "SELECT * FROM users WHERE username = ?", [username]
        )
    };

    static findById(id) {
        return connection.execute(
            "SELECT user_id, username, hash, salt, admin FROM users WHERE user_id = ?", [id]
        )
    };

    save() {
        /*         return connection.execute(
                    "INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)", [this.username, this.hash, this.salt] //do i need to use 'this'?
                ) */
        try {
            return connection.execute(
                "INSERT INTO users (username, hash, salt, admin) VALUES (?, ?, ?)", [this.username, this.hash, this.salt, this.admin] //do i need to use 'this'?,
            ).catch(e => {
                console.log('error', e);
            });
        } catch (e) {
            console.log('error', e);
        }
    }
}

module.exports.User = User;
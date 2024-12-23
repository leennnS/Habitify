const moment = require("moment");
/**
 * Represents a user in the system.
 * @class
 */
class User {
    /**
         * Creates an instance of the User class.
         * @constructor
         * @param {number} id - The unique identifier for the user.
         * @param {string} name - The username of the user.
         * @param {string} email - The email address of the user.
         * @param {string} pass - The password of the user.
         *  @param {string} points - The points earned by the user.
         * @param {string} profile_pic - The profile picture URL of the user.
         * @param {string} created_at - The date and time when the user was created.
         */
    constructor(id, name, email, pass, profile_picture, points, created_at) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.pass = pass;
        this.profile_picture = profile_picture;
        this.points = points;
        this.created_at = created_at;
    }
    /**
         * Converts a database row into a User object.
         * @static
         * @param {Object} row - The row data retrieved from the database.
         * @param {number} row.user_id - The user's unique ID.
         * @param {string} row.username - The user's username.
         * @param {string} row.email - The user's email address.
         * @param {string} row.password - The user's password.
         * @param {string} row.profile_photo - The URL of the user's profile picture.
         * @param {string} row.points - the points earned by the user
         * @param {string} row.created_at - The timestamp when the user was created.
         * @returns {User} A new User object created from the database row.
         */
    static fromRow(row) {
        return new User(
            row.user_id,
            row.username,
            row.email,
            row.password,
            row.profile_picture,
            row.points,
            moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
        );
    }
}
module.exports = User;


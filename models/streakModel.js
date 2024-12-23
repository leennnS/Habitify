const moment = require("moment");
/**
 * @class Streak
 * @description Represents a user's streak in the system, including streak count and last updated date.
 */
class Streak {
    /**
         * Creates an instance of Streak.
         * @constructor
         * @param {number} id - The streak's unique identifier.
         * @param {number} user_id - The ID of the user associated with the streak.
         * @param {number} streak_count - The number of consecutive days the user has maintained the streak.
         * @param {string} last_updated - The date and time when the streak was last updated.
         */
    constructor(id, user_id, streak_count, last_updated) {
        this.id = id;
        this.user_id = user_id;
        this.streak_count = streak_count;
        this.last_updated = last_updated;
    }

    /**
         * Maps a database row to a Streak instance.
         * @static
         * @param {Object} row - The database row representing the streak.
         * @param {number} row.streak_id - The streak's unique identifier.
         * @param {number} row.user_id - The ID of the user associated with the streak.
         * @param {number} row.streak_count - The number of consecutive days the user has maintained the streak.
         * @param {string} row.last_updated - The date and time when the streak was last updated in the database.
         * @returns {Streak} A new instance of the Streak class.
         */
    static fromRow(row) {
        return new Streak(
            row.streak_id,
            row.user_id,
            row.streak_count,
            moment(row.last_updated).format("YYYY-MM-DD HH:mm:ss"),
        );
    }
}
module.exports = Streak;
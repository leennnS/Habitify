const moment = require("moment");

class Habit {
    /**
         * Represents a habit.
         * @constructor
         * @param {number} id - The unique identifier for the habit.
         * @param {number} user_id - The unique identifier for the user associated with the habit.
         * @param {string} habit_name - The name of the habit.
         * @param {string} created_at - The date and time when the habit was created.
         */
    constructor(id, user_id, habit_name, created_at, completed) {
        this.id = id;
        this.user_id = user_id;
        this.habit_name = habit_name;
        this.created_at = created_at;
        this.completed = completed;
    }
    /**
        * Transforms a database row into a Habit instance.
        * @static
        * @param {Object} row - A row from the database containing habit information.
        * @param {number} row.habit_id - The habit ID.
        * @param {number} row.user_id - The user ID.
        * @param {string} row.habit_name - The name of the habit.
         * @param {string} row.completed - if habit was completed
        * @param {string} row.created_at - The timestamp of when the habit was created.
        * @returns {Habit} A new Habit instance with the given data.
        * @throws {Error} Will throw an error if the row format is incorrect.
        */
    static fromRow(row) {
        return new Habit(
            row.habit_id,
            row.user_id,
            row.habit_name,
            moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
            row.completed,
        );
    }
}
module.exports = Habit;
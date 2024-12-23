const { initDB } = require('../config/database.js');
const Daily = require('../models/dailyModel.js');
const streakService = require('../services/streakService.js');

class DailyService {

    constructor() {
        this.pool = null;
        this.init()
    }
    /**
         * Initializes the database connection.
         * @returns {Promise<void>} 
         */
    async init() {
        this.pool = await initDB()
    }
    /**
         * Fetches all daily tasks from the database.
         * @returns {Promise<Array<Daily>>} An array of daily task objects.
         * @throws {Error} If there is an error retrieving the dailies.
         */
    async getAllDailies() {
        try {
            const [rows] = await this.pool.query(`SELECT daily_id, user_id, task_name, completed, created_at, last_completed_date FROM dailies `);
            return rows.map(Daily.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch dailies from the database');
        }
    }
    /**
         * Fetches a daily task by its ID.
         * @param {number} id The ID of the daily task.
         * @returns {Promise<Daily|null>} The daily task object or null if not found.
         * @throws {Error} If there is an error retrieving the daily task.
         */
    async getDailyById(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM dailies  WHERE daily_id =?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return Daily.fromRow(rows[0]);
        } catch (error) {

            throw new Error('Failed to fetch daily from the database');
        }
    }
    /**
         * Fetches a daily task by the user's ID.
         * @param {number} id The user ID.
         * @returns {Promise<Daily|null>} The daily task object or null if not found.
         * @throws {Error} If there is an error retrieving the daily task.
         */
    async getDailyByUserId(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM dailies  WHERE user_id =?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return rows.map(Daily.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch daily from the database');
        }
    }
    /**
         * Creates a new daily task.
         * @param {Object} DailyData Data for the new daily task.
         * @param {number} DailyData.user_id The user ID associated with the task.
         * @param {string} DailyData.task_name The name of the task.
         * @returns {Promise<Daily|null>} The newly created daily task object or null if user does not exist.
         * @throws {Error} If there is an error creating the daily task.
         */
    async createDaily(DailyData) {
        try {
            const { user_id, task_name } = DailyData;
            const [userExists] = await this.pool.query(`SELECT user_id FROM users WHERE user_id = ?`, [user_id]);

            if (userExists.length === 0)
                throw new Error(`User not found`);

            const [existingTask] = await this.pool.query(
                `SELECT * FROM dailies WHERE user_id = ? AND task_name = ?`,
                [user_id, task_name]
            );


            if (existingTask.length > 0) {
                throw new Error(`A daily task with the task name "${task_name}" already exists for this user.`);
            }

            const [result] = await this.pool.query(`INSERT INTO dailies 
            (user_id,task_name,completed,last_completed_date,created_at) VALUES (?,?,false,NULL,NOW())`, [user_id, task_name]);

            const [insertedDaily] = await this.pool.query(`SELECT * FROM dailies 
                WHERE daily_id = ?`, [result.insertId]);

            return insertedDaily[0];

        } catch (error) {

            throw error;
        }
    }
    /**
         * Updates a daily task.
         * @param {number} id The ID of the daily task to update.
         * @param {Object} DailyData The data to update the task with.
         * @param {string} [DailyData.task_name] The new task name.
         * @param {boolean} [DailyData.completed] Whether the task is completed.
         * @returns {Promise<boolean>} True if the update was successful, otherwise false.
         * @throws {Error} If there is an error updating the daily task.
         */
    async updateDaily(id, DailyData) {
        try {
            const fields = [];
            const values = [];

            if (DailyData.task_name) {
                fields.push("task_name= ?");
                values.push(DailyData.task_name);
            }

            if (DailyData.completed) {
                fields.push("completed= ?");
                values.push(DailyData.completed);


                if (DailyData.completed === true || DailyData.completed == 1) {
                    fields.push("last_completed_date = ?");
                    values.push(new Date());
                }
            }
            if (fields.length === 0) {  // Check if no fields to update
                return null;
            }

            values.push(id);

            const [result] = await this.pool.query(`UPDATE  dailies SET ${fields.join(', ')} WHERE daily_id = ?`, values);
            if (DailyData.completed === true || DailyData.completed == 1) {
                // Get user_id associated with the daily task
                const [dailyData] = await this.pool.query(
                    `SELECT user_id FROM dailies WHERE daily_id = ?`,
                    [id]
                );

                if (dailyData.length > 0) {
                    const user_id = dailyData[0].user_id;

                    // Call the updateStreak method
                    await streakService.updateStreak(user_id);
                }
            }
            return result.affectedRows > 0;
        } catch (error) {

            throw new Error('Error updating Daily');
        }
    }

    /**
         * Deletes a daily task by its ID.
         * @param {number} id The ID of the daily task to delete.
         * @returns {Promise<boolean>} True if the task was deleted successfully, otherwise false.
         * @throws {Error} If there is an error deleting the daily task.
         */
    async deleteDaily(id) {
        try {
            const [result] = await this.pool.query(`DELETE from dailies 
                WHERE daily_id  = ? `, [id]);
            return result.affectedRows > 0;
        } catch (error) {

            throw new Error('Error deleting daily');
        }
    }
}

module.exports = new DailyService();




const { initDB } = require('../config/database.js');
const Habit = require('../models/habitModel');
/**
 * Service class responsible for managing habit-related operations.
 * This includes retrieving, creating, updating, and deleting habit records.
 * 
 * @class HabitService
 */
class HabitService {
    /**
         * Creates an instance of HabitService and initializes the database connection pool.
         * @constructor
         */
    constructor() {
        this.pool = null;
        this.init()
    }
    /**
         * Initializes the database connection pool.
         * This is called when the HabitService instance is created.
         * @returns {Promise<void>} Resolves when the pool is successfully initialized.
         */
    async init() {
        this.pool = await initDB()
    }
    /**
         * Retrieves all habits from the database.
         * @returns {Promise<Array<Habit>>} A promise that resolves to an array of habit objects.
         * @throws {Error} Throws an error if the query fails.
         */
    async getAllHabits() {
        try {
            const [rows] = await this.pool.query(`SELECT habit_id,user_id,habit_name,created_at FROM habits`);
            return rows.map(Habit.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch habits from the database');
        }
    }
    /**
        * Retrieves all habits for a given user by their user ID.
        * @param {number} id The user ID to search for.
        * @returns {Promise<Array<Habit>|null>} A promise that resolves to an array of habit objects if found, or `null` if no habits are found.
        * @throws {Error} Throws an error if the query fails.
        */
    async getAllHabitsByUserId(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM habits 
                WHERE user_id =?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return rows.map(Habit.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch habit from the database');
        }

    }

    /**
         * Retrieves a habit by its habit ID.
         * @param {number} id The habit ID to search for.
         * @returns {Promise<Habit|null>} A promise that resolves to a habit object if found, or `null` if no habit is found.
         * @throws {Error} Throws an error if the query fails.
         */
    async getHabitById(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM habits 
                WHERE habit_id = ?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return Habit.fromRow(rows[0]);
        } catch (error) {

            throw new Error('Failed to fetch habit from the database');
        }
    }
    /**
         * Creates a new habit in the database.
         * @param {Object} habitData The habit data to create the new habit.
         * @param {number} habitData.user_id The user ID associated with the new habit.
         * @param {string} habitData.habit_name The name of the new habit.
         * @returns {Promise<Habit>} A promise that resolves to the newly created habit object.
         * @throws {Error} Throws an error if a habit with the same name already exists, or if the query fails.
         */
    async createHabit(habitData) {
        try {

            const { user_id, habit_name } = habitData;

            const [userExists] = await this.pool.query(`SELECT user_id FROM users WHERE user_id = ?`, [user_id]);

            if (userExists.length === 0)
                return null;

            const [result] = await this.pool.query(`INSERT INTO habits 
            (user_id,habit_name,created_at) VALUES (?,?,NOW())`, [user_id, habit_name]);

            const [insertedHabit] = await this.pool.query(`SELECT habit_id as id ,user_id,habit_name,created_at FROM habits 
                WHERE habit_id = ?`, [result.insertId]);

            return insertedHabit[0];

        } catch (error) {

            throw new Error('Failed to create habit');
        }
    }
    /**
         * Updates an existing habit in the database.
         * @param {number} id The ID of the habit to update.
         * @param {Object} habitData The habit data to update.
         * @param {string} [habitData.habit_name] The new name of the habit.
         * @returns {Promise<boolean>} A promise that resolves to `true` if the habit was updated successfully, `false` if no rows were affected.
         * @throws {Error} Throws an error if the query fails.
         */
    async updateHabit(id, habitData) {
        try {
            const { habit_name } = habitData;
            const [result] = await this.pool.query(
                'UPDATE habits SET habit_name = ?   WHERE habit_id = ?',
                [habit_name, id]
            );
            return result.affectedRows > 0;


        } catch (error) {

            throw new Error('Error updating habit'); // Throw a more generic error message
        }
    }
    /**
    * Marks a habit as completed and increments the user's points if successful.
    * 
    * @async
    * @param {number} id - The ID of the habit to mark as completed.
    * @returns {Promise<{success: boolean, message: string}>} - Returns an object indicating if the user's points were updated.
    * @throws {Error} - Throws an error if the habit is not found, already completed, or if the update fails.
    */
    async markHabitAsCompleted(id) {
        try {

            const [habit] = await this.pool.query(
                'SELECT completed, user_id FROM habits WHERE habit_id = ?',
                [id]
            );

            // If no habit is found (habit array is empty), throw an error
            if (habit.length === 0) {
                throw new Error('Habit not found');
            }

            // If the habit is already completed, don't update and throw an error
            if (habit[0].completed === 1) {
                throw new Error('Habit is already completed');
            }

            // Update the habit to mark it as completed
            const [habitResult] = await this.pool.query(
                'UPDATE habits SET completed = 1 WHERE habit_id = ?',
                [id]
            );

            // If the update was not successful (no rows affected), throw an error
            if (habitResult.affectedRows === 0) {
                throw new Error('Habit not updated');
            }

            // Get the user ID associated with the habit
            const userId = habit[0].user_id;

            // Increment the user's points by 1 for completing the habit
            const [userResult] = await this.pool.query(
                'UPDATE users SET points = points + 1 WHERE user_id = ?',
                [userId]
            );

            return { success: userResult.affectedRows > 0, message: 'Points updated' };
        } catch (error) {

            throw error;
        }
    }
    /**
         * Deletes a habit by its habit ID.
         * @param {number} id The ID of the habit to delete.
         * @returns {Promise<boolean>} A promise that resolves to `true` if the habit was deleted successfully, `false` otherwise.
         * @throws {Error} Throws an error if the query fails.
         */
    async deleteHabit(id) {
        try {
            const [result] = await this.pool.query(`DELETE from habits 
                WHERE habit_id  = ? `, [id]);
            return result.affectedRows > 0;
        } catch (error) {

            throw new Error('Error deleting habit'); // Throw a more generic error message
        }
    }
}

module.exports = new HabitService();




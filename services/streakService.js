const { initDB } = require('../config/database.js');
const streak = require('../models/streakModel.js');
const badgeService = require('../services/badgeService');
const moment = require('moment');

/**
 * Service class responsible for managing streak-related operations.
 * This includes retrieving, creating, updating, and deleting streak records.
 * 
 * @class StreakService
 */
class StreakService {
    /**
         * Creates an instance of StreakService and initializes the database connection pool.
         * @constructor
         */
    constructor() {
        this.pool = null;
        this.init()
    }
    /**
         * Initializes the database connection pool.
         * 
         * @method init
         * @returns {Promise<void>} Resolves when the pool is initialized.
         */
    async init() {
        this.pool = await initDB()
    }
    /**
         * Retrieves all streak records from the database.
         * 
         * @method getAllStreaks
         * @returns {Promise<Array|null>} A list of streaks or null if none are found.
         * @throws {Error} If there's an error fetching streaks from the database.
         */
    async getAllStreaks() {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM streaks `);
            if (rows.length == 0) {
                return null;
            }
            return rows.map(streak.fromRow);
        } catch (error) {
            console.error('Error in getAllStreaks service:', error);
            throw new Error('Failed to fetch streaks from the database');
        }
    }
    /**
         * Retrieves a specific streak by its ID.
         * 
         * @method getStreakById
         * @param {number} id - The streak ID.
         * @returns {Promise<Object|null>} The streak object or null if not found.
         * @throws {Error} If there's an error fetching the streak from the database.
         */
    async getStreakById(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM streaks  WHERE streak_id = ?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return streak.fromRow(rows[0]);
        } catch (error) {
            console.error('Error in getStreakById service:', error);
            throw new Error('Failed to fetch streak from the database');
        }
    }
    /**
         * Retrieves streaks for a specific user by their user ID.
         * 
         * @method getStreakByUserId
         * @param {number} id - The user ID.
         * @returns {Promise<Array|null>} A list of streaks or null if none are found.
         * @throws {Error} If there's an error fetching the streaks from the database.
         */
    async getStreakByUserId(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM streaks  WHERE user_id = ?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return streak.fromRow(rows[0]);
        } catch (error) {

            //throw new Error('Failed to fetch streak from the database');
        }
    }
    /**
         * Creates a new streak for a user.
         * 
         * @method createStreak
         * @param {Object} StreakData - The data for the new streak.
         * @param {number} StreakData.user_id - The user ID to associate with the streak.
         * @returns {Promise<Object|null>} The created streak object or null if user doesn't exist.
         * @throws {Error} If there's an error creating the streak.
         */
    async createStreak(StreakData) {
        try {
            const { user_id } = StreakData;
            const [userExists] = await this.pool.query(`SELECT user_id FROM users WHERE user_id = ?`, [user_id]);

            if (userExists.length === 0)
                return null;
            const [checkstreak] = await this.pool.query('SELECT streak_id  FROM streaks WHERE user_id=?', [user_id]);
            if (checkstreak.length > 0) {
                throw new Error('streak already exists');
            }

            const [result] = await this.pool.query(`INSERT INTO streaks (user_id, streak_count, last_updated) 
                VALUES (?, 0, CURDATE())`, [user_id]);

            const [insertedStreak] = await this.pool.query(`SELECT streak_id as id ,user_id,streak_count,last_updated FROM streaks 
                WHERE streak_id = ?`, [result.insertId]);
            return insertedStreak[0];
        } catch (error) {

            throw error;
        }
    }
    /**
         * Updates the streak for a user based on their last streak date.
         * If more than one day has passed since the last streak, it resets the count.
         * If the streak reaches a multiple of 10, a badge is awarded.
         * 
         * @method updateStreak
         * @param {number} user_id - The user ID to update the streak for.
         * @returns {Promise<Object|null>} The updated streak object or null if no streak exists for the user.
         * @throws {Error} If there's an error updating the streak.
         */
    async updateStreak(user_id) {

        try {

            const [streakData] = await this.pool.query(`
                    SELECT * FROM streaks WHERE user_id = ?`, [user_id]
            );


            if (streakData.length === 0) {
                return null;
            }

            const streak = streakData[0];
            const lastUpdated = new Date(streak.last_updated);
            const today = new Date();

            lastUpdated.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);



            // Calculate the difference in days
            const dayDifference = Math.floor((today - lastUpdated) / (1000 * 60 * 60 * 24)); //millissecond,secomd,minute,hour of day


            let newCount;
            if (dayDifference === 1) {
                // If last updated yesterday, increment streak
                newCount = streak.streak_count + 1;
            } else if (dayDifference > 1) {
                // If more than one day has passed, reset streak
                newCount = 0;
            } else {

                throw new Error('streak up to date no update on streak count!');
            }

            // Update streak count and last_updated date
            await this.pool.query(`
                    UPDATE streaks SET streak_count = ?, last_updated = CURDATE() 
                    WHERE user_id = ?`, [newCount, user_id]
            );
            const last_updated = moment(today).format('YYYY-MM-DD');

            if (newCount > 0 && newCount % 10 == 0) {

                await badgeService.createBadge({
                    user_id: user_id,
                    badge_name: `${newCount}-day streak`,
                    badge_id: null,
                    badge_description: `Awarded for ${newCount}-day streak `,
                    awarded_date: new Date()
                });
            }

            return { user_id, streak_count: newCount, last_updated };
        } catch (error) {
            throw error;
        }
    }

    /**
         * Deletes a streak by its ID.
         * 
         * @method deleteStreak
         * @param {number} id - The streak ID to delete.
         * @returns {Promise<boolean>} True if the streak was deleted, otherwise false.
         * @throws {Error} If there's an error deleting the streak.
         */
    async deleteStreak(id) {
        try {
            const [result] = await this.pool.query(`DELETE from streaks 
                WHERE streak_id  = ? `, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting streak:', error);
            throw new Error('Error deleting streak');
        }
    }
}

module.exports = new StreakService();




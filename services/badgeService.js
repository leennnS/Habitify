const { initDB } = require('../config/database.js');
const badge = require('../models/badgeModel');

class BadgeService {

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
         * Fetches all badges from the database.
         * @returns {Promise<Array<badge>>} An array of badge objects.
         * @throws {Error} If there is an error retrieving the badges.
         */
    async getAllBadges() {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM badges`);
            return rows.map(badge.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch badges from the database');
        }
    }
    /**
         * Fetches all badges for a specific user by user ID.
         * @param {number} id The user ID.
         * @returns {Promise<badge|null>} The badge object or null if not found.
         * @throws {Error} If there is an error retrieving the badges.
         */
    async getAllBadgesByUserId(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM badges 
                WHERE user_id =?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return rows.map(badge.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch badge from the database');
        }

    }

    /**
        * Fetches a badge by its ID.
        * @param {number} id The badge ID.
        * @returns {Promise<badge|null>} The badge object or null if not found.
        * @throws {Error} If there is an error retrieving the badge.
        */
    async getBadgeById(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM badges 
                WHERE badge_id =?`, [id]);
            if (rows.length == 0) {
                return null;
            }
            return badge.fromRow(rows[0]);
        } catch (error) {

            throw new Error('Failed to fetch badge from the database');
        }
    }
    /**
        * Creates a new badge.
        * @param {Object} badgeData The data for the new badge.
        * @param {number} badgeData.user_id The user ID associated with the badge.
        * @param {string} badgeData.badge_name The name of the badge.
        * @param {string} badgeData.badge_description The description of the badge.
        * @returns {Promise<badge|null>} The newly created badge object or null if user does not exist.
        * @throws {Error} If there is an error creating the badge.
        */
    async createBadge(badgeData) {
        try {
            const { user_id, badge_name, badge_description } = badgeData;

            const [userExists] = await this.pool.query(`SELECT user_id FROM users WHERE user_id = ?`, [user_id]);

            if (userExists.length === 0)
                return null;

            const [result] = await this.pool.query(`INSERT INTO badges 
            (user_id,badge_name,badge_description,awarded_date) VALUES (?,?,?,NOW())`, [user_id, badge_name, badge_description]);

            const [insertedBadge] = await this.pool.query(`SELECT * FROM badges 
                WHERE badge_id = ?`, [result.insertId]);

            return insertedBadge[0];

        } catch (error) {

            throw new Error('Failed to create badge');
        }
    }
    /**
         * Updates an existing badge.
         * @param {number} id The ID of the badge to update.
         * @param {Object} badgeData The data to update the badge with.
         * @param {string} [badgeData.badge_name] The new name of the badge.
         * @param {string} [badgeData.badge_description] The new description of the badge.
         * @returns {Promise<boolean>} True if the update was successful, otherwise false.
         * @throws {Error} If there is an error updating the badge.
         */
    async updateBadge(id, BadgeData) {
        try {
            const { badge_name, badge_description } = BadgeData;
            const fields = [];
            const values = [];
            if (badge_name) {
                fields.push('badge_name= ?');
                values.push(badge_name);
            }

            if (badge_description) {
                fields.push('badge_description=?');
                values.push(badge_description);
            }

            if (fields.length === 0) {
                throw new Error('No fields found to update')
            }

            values.push(id);

            const query =
                `UPDATE badges SET ${fields.join(', ')} WHERE badge_id = ?`

            const [result] = await this.pool.query(query, values);

            return result.affectedRows > 0;


        } catch (error) {

            throw error;
        }
    }
    /**
         * Deletes a badge by its ID.
         * @param {number} id The badge ID to delete.
         * @returns {Promise<boolean>} True if the badge was deleted successfully, otherwise false.
         * @throws {Error} If there is an error deleting the badge.
         */
    async deleteBadge(id) {
        try {
            const [result] = await this.pool.query(`DELETE from badges 
                WHERE badge_id  = ? `, [id]);
            return result.affectedRows > 0;
        } catch (error) {

            throw new Error('Error deleting badge'); // Throw a more generic error message
        }
    }
}

module.exports = new BadgeService();




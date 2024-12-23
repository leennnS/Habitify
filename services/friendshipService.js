const { initDB } = require('../config/database.js');
const friendship = require('../models/friendshipModel');

class FriendshipService {

    constructor() {
        this.pool = null;
        this.init();
    }
    /**
         * Initializes the database connection pool.
         * @returns {Promise<void>} Resolves when the database connection is successfully initialized.
         */
    async init() {
        this.pool = await initDB();
    }
    /**
         * Retrieves all friendships from the database.
         * @returns {Promise<Array>} A list of all friendships.
         * @throws {Error} Throws an error if the query fails.
         */
    async getAllFriendships() {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM friendships`);
            return rows.map(friendship.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch friendships from the database');
        }
    }
    /**
     * Searches for friends based on the provided user ID and search term (username).
     * @param {number} user_id The ID of the user performing the search.
     * @param {string} friendData The username or part of the username to search for.
     * @returns {Promise<Array|null>} A list of matching friends or null if no matches are found.
     * @throws {Error} Throws an error if the query fails.
     */
    async searchFriend(user_id, friendData) {
        try {

            const query = `
            SELECT u.user_id, u.username,friendship_id,f.created_at
            FROM friendships f
            JOIN users u ON (f.friend_id = u.user_id OR f.user_id = u.user_id)
            WHERE (f.user_id = ? OR f.friend_id = ?)
            AND f.status = 'accepted'
            AND u.username LIKE ?`;

            const values = [user_id, user_id, `%${friendData}%`];

            const [rows] = await this.pool.query(query, values);

            if (rows.length == 0)
                return null;

            return rows;

        } catch (error) {

            throw error;
        }
    }
    /**
         * Retrieves a friendship by its ID.
         * @param {number} id The ID of the friendship.
         * @returns {Promise<Object|null>} The friendship object if found, otherwise null.
         * @throws {Error} Throws an error if the query fails.
         */
    async getFriendshipById(id) {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM friendships WHERE friendship_id = ?`, [id]);

            if (rows.length == 0) {
                return null;
            }
            return friendship.fromRow(rows[0]);
        } catch (error) {

            throw new Error('Failed to fetch friendship from the database');
        }
    }
    /**
         * Retrieves the list of friends for a user.
         * @param {number} user_id The ID of the user.
         * @returns {Promise<Array>} A list of the user's friends.
         * @throws {Error} Throws an error if the query fails.
         */
    async getFriends(user_id) {
        try {
            const [friends] = await this.pool.query(`
                SELECT friendships.friendship_id, friendships.user_id, friendships.friend_id, friendships.status, friendships.created_at, 
                users.username, users.email, users.profile_picture 
                FROM friendships 
                JOIN users ON (friendships.friend_id = users.user_id OR friendships.user_id = users.user_id)
                WHERE (friendships.user_id = ? OR friendships.friend_id = ?)  AND users.user_id != ? AND friendships.status = 'accepted';`, [user_id, user_id, user_id]
            );
            if (friends.length === 0)
                throw new error('no friends');

            return friends.map(friendship.fromRow);

        } catch (error) {

            //throw new Error('Failed to get friends');
        }
    }

    /**
         * Creates a new friendship between two users.
         * @param {Object} friendshipData The friendship data containing user_id and friend_id.
         * @returns {Promise<Object>} The created friendship object.
         * @throws {Error} Throws an error if the users don't exist or if the friendship already exists.
         */

    async createFriendship(friendshipData) {
        try {
            const { user_id, friend_id } = friendshipData

            if (user_id == friend_id) {
                throw new Error('Cant create friendship with yourself');
            }
            // Check if the users exist
            const [userExists] = await this.pool.query('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
            const [friendExists] = await this.pool.query('SELECT user_id FROM users WHERE user_id = ?', [friend_id]);

            if (userExists.length === 0 || friendExists.length === 0) {
                throw new Error('User or Friend does not exist');
            }


            // Check if the friendship already exists (pending or accepted)
            const [existingFriendship] = await this.pool.query(
                `SELECT friendship_id as id,user_id,friend_id,status,created_at 
                FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
                [user_id, friend_id, friend_id, user_id]
            );

            if (existingFriendship.length > 0) {
                throw new Error('Friendship already exists');
            }

            // Insert a new friendship with 'pending' status
            const [result] = await this.pool.query(
                `INSERT INTO friendships (user_id, friend_id, status,created_at) VALUES (?, ?, 'pending',NOW())`,
                [user_id, friend_id]
            );

            const [insertedFriendship] = await this.pool.query(`SELECT friendship_id as id,user_id, friend_id, status,created_at 
                FROM friendships 
                WHERE friendship_id = ?`, [result.insertId]);


            return insertedFriendship[0];

        } catch (error) {

            throw error;
        }
    }
    /**
        * Updates the status of a friendship.
        * @param {number} friendship_id The ID of the friendship to update.
        * @param {Object} friendshipData The new data for the friendship.
        * @returns {Promise<boolean>} True if the update was successful, false otherwise.
        * @throws {Error} Throws an error if the status is invalid or if the update fails.
        */
    async updateFriendship(friendship_id, friendshipData) {
        try {

            const { status } = friendshipData

            if (!['pending', 'accepted'].includes(status)) {
                throw new Error('Invalid status');
            }

            // Update the friendship status

            const [result] = await this.pool.query(
                `UPDATE friendships SET status = ? WHERE friendship_id = ?`,
                [status, friendship_id]
            );


            return result.affectedRows > 0;

        } catch (error) {

            throw error;
        }
    }
    /**
         * Retrieves all pending friendship requests for a user.
         * @param {number} user_id The ID of the user.
         * @returns {Promise<Array|null>} A list of pending requests or null if none are found.
         * @throws {Error} Throws an error if the query fails.
         */
    async getPendingRequests(user_id) {
        try {
            const [pendingRequests] = await this.pool.query(`SELECT u.user_id, u.username,f.friendship_id,u.profile_picture
                    FROM friendships f
                    JOIN users u ON (f.friend_id = u.user_id OR f.user_id = u.user_id)
                    WHERE (f.user_id = ? OR f.friend_id = ?) 
                     AND f.status = 'pending'
                    AND u.user_id != ? `, [user_id, user_id, user_id]);
            if (!pendingRequests) {
                return null;
            }

            return pendingRequests;

        } catch (error) {

            // throw new Error('Failed to fetch pending requests ');
        }

    }
    /**
       * Deletes a friendship from the database.
       * @param {number} id The ID of the friendship to delete.
       * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
       * @throws {Error} Throws an error if the query fails.
       */
    async deleteFriendship(id) {
        try {
            const [result] = await this.pool.query(`DELETE FROM friendships WHERE friendship_id = ?`, [id]);

            return result.affectedRows > 0;

        } catch (error) {

            throw new Error('Failed to delete friendship ');
        }
    }
    /**
         * Sends a friend request to another user.
         * @param {Object} friendshipData The data for the friendship (user_id, friend_id).
         * @returns {Promise<Object>} The created friendship object.
         * @throws {Error} Throws an error if the request fails.
         */
    async sendFriendRequest(friendshipData) {
        try {
            const { user_id, friend_id } = friendshipData
            return await this.createFriendship({ user_id, friend_id });

        } catch (error) {
            throw error;
        }
    }

    /**
         * Accepts a pending friend request.
         * @param {number} friendship_id The ID of the friendship request to accept.
         * @returns {Promise<void>} Resolves if the request is successfully accepted.
         * @throws {Error} Throws an error if the request cannot be accepted.
         */
    async acceptFriendRequest(friendship_id) {
        try {

            // Check if the friendship exists and is in 'pending' status before accepting
            const [checkStatus] = await this.pool.query(
                `SELECT status FROM friendships WHERE friendship_id = ?`,
                [friendship_id]
            );

            if (checkStatus.length === 0) {
                throw new Error('Friendship not found');
            }

            if (checkStatus[0].status !== 'pending') {
                throw new Error('Friendship is not pending');
            }

            // Accept the friend request (update status to 'accepted')
            const updated = await this.updateFriendship(friendship_id, { status: 'accepted' });

            if (!updated) {
                throw new Error('Failed to accept friend request');
            }


        } catch (error) {

            throw error;
        }
    }
    /**
         * Rejects a pending friend request and deletes it from friendship table.
         * @param {number} friendship_id The ID of the friendship request to reject.
         * @returns {Promise<void>} Resolves if the request is successfully rejected.
         * @throws {Error} Throws an error if the request cannot be rejected.
         */
    async rejectFriendRequest(friendship_id) {
        try {
            const [checkStatus] = await this.pool.query(`SELECT status FROM friendships WHERE friendship_id = ?`, [friendship_id]);

            if (checkStatus.length == 0) {
                throw new Error('Friendship not found');
            }

            if (checkStatus[0].status !== 'pending') {
                throw new Error('Friendship is not pending');
            }

            const deleted = await this.deleteFriendship(friendship_id);

            if (!deleted) {
                throw new Error('Failed to reject friend request');
            }


        } catch (error) {

            throw error;
        }
    }
}




module.exports = new FriendshipService();





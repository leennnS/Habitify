const { initDB } = require('../config/database');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const streakService = require('./streakService');

/**
 * UserService handles all database interactions related to users.
 * It provides methods for fetching, creating, updating, and deleting users.
 */
class UserService {
    /**
         * Creates an instance of UserService and initializes the database connection pool.
         * @constructor
         */
    constructor() {
        this.pool = null;
        this.init();
    }
    /**
         * Initializes the database connection pool.
         * This is called when the UserService instance is created.
         * @returns {Promise<void>} Resolves when the pool is successfully initialized.
         */
    async init() {
        this.pool = await initDB();
    }

    /**
    * Retrieves all users from the database.
    * @returns {Promise<Array<User>>} A promise that resolves to an array of user objects.
    * @throws {Error} Throws an error if the query fails.
    */
    async getAllUsers() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM users');
            return rows.map(User.fromRow);
        } catch (error) {

            throw new Error('Failed to fetch users from the database');
        }
    }
    /**
         * Searches for users by a keyword in their username.
         * @param {string} keyword The keyword to search in the username field.
         * @returns {Promise<Array<Object>|null>} A promise that resolves to an array of matching user objects, or `null` if no users are found.
         * @throws {Error} Throws an error if the query fails.
         */
    async searchUsers(keyword) {
        try {

            const query = `SELECT user_id,username,email,profile_picture,points,created_at AS member_since
            FROM users
            WHERE username LIKE ?`;

            const values = [`%${keyword}%`];

            const [rows] = await this.pool.query(query, values);

            if (rows.length == 0) {
                return null;
            }
            return rows;
        } catch (error) {

            throw error;
        }
    }

    /**
         * Retrieves a user by their user ID.
         * @param {number} id The user ID to search for.
         * @returns {Promise<User|null>} A promise that resolves to a user object if found, or `null` if no user is found.
         * @throws {Error} Throws an error if the query fails.
         */
    async getUserById(id) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM users WHERE user_id =? ', [id]);
            if (rows.length == 0)
                return null;
            return User.fromRow(rows[0]);

        } catch (error) {

            throw new Error('Failed to fetch user from the database');
        }
    }
    /**
         * Creates a new user in the database.
         * @param {Object} userData The user data to create the new user.
         * @param {string} userData.name The username of the new user.
         * @param {string} userData.email The email of the new user.
         * @param {string} userData.password The password for the new user.
         * @param {string} userData.profile_picture The profile picture URL of the new user.
         * @param {string} userData.points The points earned by the user 
         * @returns {Promise<User>} A promise that resolves to the newly created user object.
         * @throws {Error} Throws an error if a user with the same email or username already exists, or if the query fails.
         */
    async createUser(userData) {
        try {
            const { name, email, password, profile_picture } = userData;
            const hashedpassword = await bcrypt.hash(password, 10);

            const [checkduplicate] = await this.pool.query(`SELECT * FROM users WHERE email =? OR username =?`, [email, name]);

            if (checkduplicate.length > 0) {
                throw new Error(`Account with this email: ${email} or username: ${name}  already exists`);
            }

            const [result] = await this.pool.query('INSERT INTO users (username,email,password,profile_picture,points,created_at) VALUES (?,?,?,?,0,NOW())',
                [name, email, hashedpassword, profile_picture]);
            const [insertedUser] = await this.pool.query(`SELECT  user_id AS id,username, email, password ,profile_picture,points,created_at 
            FROM users
            WHERE user_id =?`, [result.insertId]);

            return insertedUser[0];
        } catch (error) {

            throw error;
        }
    }
    /**
         * Updates the user information.
         * @param {number} id The ID of the user to update.
         * @param {Object} userData The user data to update.
         * @param {string} [userData.name] The new username of the user.
         * @param {string} [userData.email] The new email of the user.
         * @param {string} [userData.password] The new password of the user.
         *  @param {string} userData.points The points earned by the user
         * @param {string} [userData.profile_picture] The new profile picture URL of the user.
         * @returns {Promise<boolean>} A promise that resolves to `true` if the user was updated successfully, `false` if no rows were affected.
         * @throws {Error} Throws an error if the username or email already exists, or if the query fails.
         */
    async updateUser(id, userData) {


        try {
            // Initialize an array to hold the fields to update and a corresponding values array
            const fields = [];
            const values = [];

            // Only include fields that are provided
            if (userData.name) {
                const [usernameCheck] = await this.pool.query(
                    `SELECT user_id FROM users WHERE username = ? AND user_id != ?`,
                    [userData.name, id]
                );
                if (usernameCheck.length > 0) {
                    throw new Error(`An account with this username already exists.`);
                }

                fields.push('username = ?');
                values.push(userData.name);
            }
            if (userData.email) {
                const [emailCheck] = await this.pool.query(
                    `SELECT user_id FROM users WHERE email = ? AND user_id != ?`,
                    [userData.email, id]
                );
                if (emailCheck.length > 0) {
                    throw new Error(`An account with this email already exists.`);
                }

                fields.push('email = ?');
                values.push(userData.email);
            }
            if (userData.password) {
                fields.push('password = ?');
                const hashedpassword = await bcrypt.hash(userData.password, 10);
                values.push(hashedpassword);
            }
            if (userData.profile_picture) {
                fields.push('profile_picture = ?');
                values.push(userData.profile_picture);
            }
            const [checkduplicate] = await this.pool.query(`SELECT * FROM users WHERE email =? OR username =?`, [userData.email, userData.name]);

            if (checkduplicate.length > 0) {
                throw new Error(`Account with this email: ${userData.email} or username: ${userData.name}  already exists`);
            }

            // Add the user ID to the values array at the end
            values.push(id);

            // Execute the query
            const [result] = await this.pool.query
                (`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, values);

            // Check if any rows were updated
            return result.affectedRows > 0;
        } catch (error) {

            throw (error);
        }
    }

    /**
        * Deletes a user by their user ID.
        * @param {number} id The ID of the user to delete.
        * @returns {Promise<boolean>} A promise that resolves to `true` if the user was deleted successfully, `false` otherwise.
        * @throws {Error} Throws an error if the query fails.
        */
    async deleteUser(id) {
        try {
            const [result] = await this.pool.query('DELETE FROM users WHERE user_id=?', [id]);
            return result.affectedRows > 0;
        } catch (error) {

            throw new Error('Error deleting user');
        }
    }


    // Signup: Create a new user
    async signupUser(user) {
        const { username, email, password } = user;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Insert user into the database
        const [result] = await this.pool.query(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );

        // Get the inserted user's ID
        const user_id = result.insertId;

        await streakService.createStreak({ user_id });

        // Return the user object with user_id
        return { user_id, username, email };
    }


    // Login: Verify user credentials and generate JWT
    async loginUser(email, password) {
        // Validate input

        // Fetch user from database
        const [rows] = await this.pool.query(`SELECT * FROM users WHERE email = ?`, [email]);

        if (rows.length === 0) {
            throw new Error('No Acc');
        }

        const user = rows[0]; // Extract the user object from the result rows

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return { user }; // Return token and user
    }

}
module.exports = new UserService();

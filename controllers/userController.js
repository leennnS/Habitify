const userService = require('../services/userService');
/**
 * Controller to handle user-related operations (CRUD).
 * @class
 */
class UserController {
    /**
         * Fetches all users.
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with all users or an error message.
         */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
    * Searches for users based on a keyword.
    * @async
    * @param {Object} req - The request object.
    * @param {Object} res - The response object.
    * @returns {void} - Sends a JSON response with the search results or an error message.
    */
    async searchUsers(req, res) {
        try {
            const { q: keyword } = req.query;
            if (!keyword) {
                return res.status(400).json({ message: 'Search keyword is required' });
            }
            const users = await userService.searchUsers(keyword);
            const loggedId = req.session.user.user_id;
            if (!users)
                return res.status(404).json({ message: 'user not found' })
            res.render('search', { users, loggedId });

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
        * Fetches a user by their ID.
        * @async
        * @param {Object} req - The request object containing the user ID.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response with the user details or an error message.
        */
    async getUserById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const users = await userService.getUserById(id);
            if (!users)
                return res.status(404).json({ message: 'User not found' });
            res.json(users);
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
   * Creates a new user.
   * @async
   * @param {Object} req - The request object containing the user data.
   * @param {Object} res - The response object.
   * @returns {void} - Sends a JSON response with the created user or an error message.
   */
    async createUser(req, res) {
        try {
            const { name, email, password, profile_picture, created_at } = req.body;

            const newUser = await userService.createUser({ name, email, password, profile_picture, created_at });
            res.status(201).json(newUser);

        } catch (error) {
            if (error.message.includes(`Account with this`))
                return res.status(400).json({ message: error.message });


            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
         * Updates an existing user by ID.
         * @async
         * @param {Object} req - The request object containing the user ID and updated data.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response indicating success or failure.
         */
    async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { name, email, password } = req.body;
            let profile_picture = req.file ? `/images/${req.file.filename}` : null;
            const success = await userService.updateUser(id, { name, email, password, profile_picture });

            if (!success) {
                return res.status(404).json({ message: ' User not found or no changes made' });
            }
            //res.json({ message: 'User updated successfully' });
            res.redirect(`/profile/${id}`);
        } catch (error) {
            if (error.message.includes(`Account with this`))
                return res.status(400).json({ message: error.message });


            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
         * Deletes a user by ID.
         * @async
         * @param {Object} req - The request object containing the user ID.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response indicating success or failure.
         */
    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await userService.deleteUser(id);

            if (!success) {
                return res.status(404).json({ message: 'User not found' });
            }

            //res.json({ message: 'User deleted successfully' });
            res.redirect('/login');
        } catch (error) {

            res.status(500).json({ message: ' Internal server error' });
        }
    }
    // Render the signup page
    async signupUser(req, res) {
        try {
            // Check if the form was submitted
            const { username, email, password } = req.body;

            if (username && email && password) {
                // If the form is submitted with all fields, handle the signup logic
                const user = await userService.signupUser({ username, email, password });

                // After successful signup, create a session for the user with user_id and other details
                req.session.user = {
                    user_id: user.user_id,
                    username,
                    email
                };
                // Redirect to the dashboard or wherever the user should go after signup
                return res.redirect('/UserDashboard');
            } else {
                // If not all fields are provided, render the signup page
                return res.render('signup', { error: 'Please fill in all fields' });
            }

        } catch (error) {
            // Render the signup page with error message if something went wrong
            return res.render('signup', { error: error.message });
        }
    }


    // Login: Handle user login request
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const { user } = await userService.loginUser(email, password);

            req.session.user = { user_id: user.user_id, email: user.email, profile_picture: user.profile_picture, username: user.username };

            return res.redirect('/UserDashboard');
        } catch (error) {
            return res.status(401).render('login', { error: error.message });
        }
    }


};

module.exports = new UserController();

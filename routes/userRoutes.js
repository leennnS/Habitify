
const express = require('express');
const userController = require('../controllers/userController');
const { validateUser, validateUserId, validateUpdateUser } = require('../validators/userDTO');
const authenticateToken = require('../middleware/authmiddleware');
const authenticateSession = require('../middleware/authenticateSession');
const upload = require('../middleware/fileUpload');
const router = express.Router();

/**
 * Route to get all users from the database.
 * @route GET /users
 * @returns {Array<User>} 200 - An array of user objects
 * @throws {Error} 500 - Internal server error if the database query fails
 */
router.get('/', authenticateSession, (req, res) => userController.getAllUsers(req, res));
/**
 * Route to search users by username.
 * @route GET /users/search
 * @param {string} keyword.query - The keyword to search for in the username.
 * @returns {Array<User>|null} 200 - An array of matching user objects, or null if no matches are found
 * @throws {Error} 500 - Internal server error if the search query fails
 */
router.get('/search', authenticateSession, (req, res) => userController.searchUsers(req, res));
/**
 * Route to get a user by their user ID.
 * @route GET /users/{id}
 * @param {number} id.path.required - The user ID
 * @returns {User|null} 200 - A user object if found, or null if no user is found
 * @throws {Error} 400 - Bad request if the ID is invalid
 * @throws {Error} 404 - Not Found if the user does not exist
 */
router.get('/:id', authenticateSession, validateUserId, (req, res) => userController.getUserById(req, res));
/**
 * Route to create a new user in the database.
 * @route POST /users
 * @param {User} user.body.required - The user data to create a new user.
 * @returns {User} 201 - The newly created user object
 * @throws {Error} 400 - Bad request if the user data is invalid
 * @throws {Error} 409 - Conflict if a user with the same email or username already exists
 */
router.post('/', authenticateSession, validateUser, (req, res) => userController.createUser(req, res));


router.post('/signup', userController.signupUser.bind(userController)); // Bind instance
router.post('/login', userController.loginUser.bind(userController));
//router.get('/', userController.getAllUsers.bind(userController));

//router.get('/profile', authenticateToken, (req, res) => userController.getUserProfile(req, res));

/**
 * Route to update an existing user by their user ID.
 * @route PUT /users/{id}
 * @param {number} id.path.required - The user ID
 * @param {User} user.body.required - The user data to update (username, email, password, profile picture)
 * @returns {boolean} 200 - Returns true if the user was successfully updated, false otherwise
 * @throws {Error} 400 - Bad request if the data is invalid
 * @throws {Error} 404 - Not Found if the user does not exist
 */
router.post('/update/:id', authenticateSession, upload.single('profile_picture'), validateUpdateUser, (req, res) => userController.updateUser(req, res));
/**
 * Route to delete a user by their user ID.
 * @route DELETE /users/{id}
 * @param {number} id.path.required - The user ID
 * @returns {boolean} 200 - Returns true if the user was successfully deleted, false otherwise
 * @throws {Error} 400 - Bad request if the ID is invalid
 * @throws {Error} 404 - Not Found if the user does not exist
 */
router.get('/delete/:id', authenticateSession, validateUserId, (req, res) => userController.deleteUser(req, res));

module.exports = router;

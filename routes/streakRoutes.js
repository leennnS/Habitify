const express = require('express');
const StreakController = require('../controllers/streakController');
const { validateStreakId, validateStreak } = require('../validators/streakDTO');
const { validateUserId } = require('../validators/userDTO');

const router = express.Router();
/**
 * @route GET /streaks
 * @description Get all streaks
 * @access Public
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - An array of all streaks.
 */
router.get('/', (req, res) => StreakController.getAllstreaks(req, res));
/**
 * @route GET /streaks/:id
 * @description Get a specific streak by ID
 * @access Public
 * @param {string} id - Streak ID in URL parameters
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Streak details
 * @returns {Object} 404 - Streak not found
 */
router.get('/:id', validateStreakId, (req, res) => StreakController.getStreakById(req, res));
/**
 * @route GET /streaks/users/:id
 * @description Get streaks by User ID
 * @access Public
 * @param {string} id - User ID in URL parameters
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - List of streaks for the user
 * @returns {Object} 404 - User not found
 */
router.get('/users/:id', validateUserId, (req, res) => StreakController.getStreakByUserId(req, res));
/**
 * @route POST /streaks
 * @description Create a new streak
 * @access Private (Authenticated user)
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 201 - Created streak
 * @returns {Object} 400 - Bad request
 */
router.post('/', validateStreak, (req, res) => StreakController.createStreak(req, res));
/**
 * @route PUT /streaks/:id
 * @description Update a specific streak by ID
 * @access Private (Authenticated user)
 * @param {string} id - Streak ID in URL parameters
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Updated streak
 * @returns {Object} 404 - Streak not found
 */
router.put('/users/:id', validateUserId, (req, res) => StreakController.updateStreak(req, res));
/**
 * @route DELETE /streaks/:id
 * @description Delete a specific streak by ID
 * @access Private (Authenticated user)
 * @param {string} id - Streak ID in URL parameters
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success message
 * @returns {Object} 404 - Streak not found
 */
router.delete('/:id', validateStreakId, (req, res) => StreakController.deleteStreak(req, res));


module.exports = router;
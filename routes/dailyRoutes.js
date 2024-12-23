const express = require('express');
const dailyController = require('../controllers/dailyController');
const { validateDaily, validateDailyId, validateUpdateDaily } = require("../validators/dailyDTO");
const { validateUserId } = require("../validators/userDTO");

const router = express.Router();
/**
 * GET /dailies
 * Fetch all dailies in the system.
 * @route GET /dailies
 * @returns {Array<Daily>} 200 - List of all daily tasks
 * @throws {Error} 500 - If there is an error fetching dailies
 */
router.get('/', (req, res) => dailyController.getAllDailies(req, res));
/**
 * GET /dailies/:id
 * Fetch a specific daily task by its ID.
 * @route GET /dailies/:id
 * @param {string} id.path - Daily task ID
 * @returns {Daily} 200 - The daily task
 * @throws {Error} 400 - Invalid daily ID
 * @throws {Error} 404 - Daily task not found
 */
router.get('/:id', validateDailyId, (req, res) => dailyController.getDailyById(req, res));
/**
 * GET /dailies/users/:id
 * Fetch all dailies for a specific user by user ID.
 * @route GET /dailies/users/:id
 * @param {string} id.path - User ID
 * @returns {Array<Daily>} 200 - List of the user's dailies
 * @throws {Error} 400 - Invalid User ID
 * @throws {Error} 404 - User not found
 */
router.get('/users/:id', validateUserId, (req, res) => dailyController.getDailyByUserId(req, res));
/**
 * POST /dailies
 * Create a new daily task.
 * @route POST /dailies
 * @param {Daily} daily.body - Daily task data (user_id, task_name, etc.)
 * @returns {Daily} 201 - The newly created daily task
 * @throws {Error} 400 - Invalid daily data
 */
router.post('/', validateDaily, (req, res) => dailyController.createDaily(req, res));
/**
 * PUT /dailies/:id
 * Update a specific daily task by its ID.
 * @route PUT /dailies/:id
 * @param {string} id.path - Daily task ID
 * @param {DailyUpdate} daily.body - Updated task data
 * @returns {Daily} 200 - Updated daily task
 * @throws {Error} 400 - Invalid daily ID or update data
 * @throws {Error} 404 - Daily task not found
 */
router.post('/:id/update', validateDailyId, validateUpdateDaily, (req, res) => dailyController.updateDaily(req, res));
/**
 * DELETE /dailies/:id
 * Delete a specific daily task by its ID.
 * @route DELETE /dailies/:id
 * @param {string} id.path - Daily task ID
 * @returns {boolean} 200 - Success status (true if deleted)
 * @throws {Error} 400 - Invalid daily ID
 * @throws {Error} 404 - Daily task not found
 */
router.get('/delete/:id', validateDailyId, (req, res) => dailyController.deleteDaily(req, res));

module.exports = router;
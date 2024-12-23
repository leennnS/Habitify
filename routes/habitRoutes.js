const express = require('express');
const habitController = require('../controllers/habitController');
const { validateHabit, validateHabitId, validateUpdateHabit } = require("../validators/habitDTO");
const { validateUserId } = require("../validators/userDTO");

const router = express.Router();
/**
 * Route to get all habits from the database.
 * @route GET /habits
 * @returns {Array<Habit>} 200 - An array of habit objects
 * @throws {Error} 500 - Internal server error if the database query fails
 */
router.get('/', (req, res) => habitController.getAllHabits(req, res));
/**
 * Route to get all habits for a specific user by their user ID.
 * @route GET /habits/users/{id}
 * @param {number} id.path.required - The user ID to retrieve the habits for
 * @returns {Array<Habit>|null} 200 - An array of habits for the user, or null if no habits are found
 * @throws {Error} 400 - Bad request if the user ID is invalid
 * @throws {Error} 500 - Internal server error if the database query fails
 */
router.get('/users/:id', validateUserId, (req, res) => habitController.getAllHabitsByUserId(req, res));
/**
 * Route to get a specific habit by its ID.
 * @route GET /habits/{id}
 * @param {number} id.path.required - The habit ID
 * @returns {Habit|null} 200 - A habit object if found, or null if the habit does not exist
 * @throws {Error} 400 - Bad request if the habit ID is invalid
 * @throws {Error} 404 - Not Found if the habit does not exist
 */
router.get('/:id', validateHabitId, (req, res) => habitController.getHabitById(req, res));
/**
 * Route to create a new habit.
 * @route POST /habits
 * @param {Habit} habit.body.required - The habit data to create a new habit.
 * @returns {Habit} 201 - The newly created habit object
 * @throws {Error} 400 - Bad request if the habit data is invalid
 */
router.post('/', validateHabit, (req, res) => habitController.createHabit(req, res));
/**
 * Route to update an existing habit by its ID.
 * @route PUT /habits/{id}
 * @param {number} id.path.required - The habit ID
 * @param {Habit} habit.body.required - The habit data to update (habit_name, user_id)
 * @returns {boolean} 200 - Returns true if the habit was successfully updated, false otherwise
 * @throws {Error} 400 - Bad request if the data is invalid
 * @throws {Error} 404 - Not Found if the habit does not exist
 */
router.put('/:id', validateHabitId, validateUpdateHabit, (req, res) => habitController.updateHabit(req, res));
/**
 * Route to mark a habit as completed.
 * @route PUT /:id/complete
 * @param {number} id.params.required - The ID of the habit to mark as completed.
 * @returns {object} 200 - Success message if habit marked as completed.
 * @throws {Error} 404 - Not found if the habit does not exist.
 * @throws {Error} 400 - Bad request if the habit is already completed.
 */
router.post('/:id/complete', validateHabitId, (req, res) => habitController.markHabitAsCompletedController(req, res));
/**
 * Route to delete a habit by its ID.
 * @route DELETE /habits/{id}
 * @param {number} id.path.required - The habit ID
 * @returns {boolean} 200 - Returns true if the habit was successfully deleted, false otherwise
 * @throws {Error} 400 - Bad request if the habit ID is invalid
 * @throws {Error} 404 - Not Found if the habit does not exist
 */
router.get('/delete/:id', validateHabitId, (req, res) => habitController.deleteHabit(req, res));

module.exports = router;

const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new habit.
 * Validates that 'user_id' and 'habit_name' are properly formatted and required.
 *
 * @function
 * @name validateHabit
 * @returns {array} An array of validation middlewares.
 */
const validateHabit = [
    /**
      * Validates that 'user_id' is an integer and is not empty.
      * @name body('user_id')
      * @type {Validator}
      * @description 'user_id' must be an integer and cannot be empty.
      */
    body('user_id')
        .isInt()
        .withMessage('Id must be an integer')
        .notEmpty()
        .withMessage("user id is required"),
    /**
         * Validates that 'habit_name' is a non-empty string.
         * @name body('habit_name')
         * @type {Validator}
         * @description 'habit_name' must be a string and cannot be empty.
         */
    body('habit_name')
        .isString()
        .withMessage("Habit name must be a String")
        .notEmpty()
        .withMessage("Habit name is required"),
    /**
         * Checks if there are validation errors.
         * If there are errors, responds with a 400 status and the error messages.
         * Otherwise, proceeds to the next middleware.
         */
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }


];
/**
 * Validation middleware for validating the 'habit' ID parameter in the request.
 * Validates that the 'id' parameter is an integer and is required.
 *
 * @function
 * @name validateHabitId
 * @returns {array} An array of validation middlewares.
 */
const validateHabitId = [
    /**
     * Validates that the 'id' parameter is an integer and is not empty.
     * @name param('id')
     * @type {Validator}
     * @description 'id' must be an integer and cannot be empty.
     */
    param('id').isInt().withMessage('Id must be an integer')
        .notEmpty()
        .withMessage('habit id is required'),
    /**
         * Checks if there are validation errors.
         * If there are errors, responds with a 400 status and the error messages.
         * Otherwise, proceeds to the next middleware.
         */
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/**
 * Validation middleware for updating an existing habit.
 * Validates that 'habit_name' is a non-empty string.
 *
 * @function
 * @name validateUpdateHabit
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateHabit = [
    /**
     * Validates that 'habit_name' is a non-empty string.
     * @name body('habit_name')
     * @type {Validator}
     * @description 'habit_name' must be a string and cannot be empty.
     */
    body('habit_name')
        .isString()
        .withMessage("Habit name must be a String")
        .notEmpty()
        .withMessage("Habit name is required"),
    /**
         * Checks if there are validation errors.
         * If there are errors, responds with a 400 status and the error messages.
         * Otherwise, proceeds to the next middleware.
         */
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

]

module.exports = {
    validateHabit,
    validateHabitId,
    validateUpdateHabit
};


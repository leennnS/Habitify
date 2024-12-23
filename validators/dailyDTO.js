const { body, param, validationResult } = require('express-validator');
/**
 * Validation middleware for creating a new daily task.
 * Validates that 'user_id' is an integer, is not empty, and that 'task_name' is a non-empty string.
 *
 * @function
 * @name validateDaily
 * @returns {array} An array of validation middlewares.
 */
const validateDaily = [
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
        .withMessage('user id is required'),
    /**
         * Validates that 'task_name' is a string and is not empty.
         * @name body('task_name')
         * @type {Validator}
         * @description 'task_name' must be a non-empty string.
         */
    body('task_name')
        .isString()
        .withMessage("task name must be a String")
        .notEmpty()
        .withMessage("task name is required"),

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
 * Validation middleware for validating the 'id' parameter of a daily task.
 * Ensures that the 'id' is an integer and is required.
 *
 * @function
 * @name validateDailyId
 * @returns {array} An array of validation middlewares.
 */
const validateDailyId = [
    /**
     * Validates that the 'id' parameter is an integer and is not empty.
     * @name param('id')
     * @type {Validator}
     * @description 'id' must be an integer and cannot be empty.
     */
    param('id')
        .isInt()
        .withMessage('Id must be an integer')
        .notEmpty()
        .withMessage("task name is required"),

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
 * Validation middleware for updating a daily task.
 * Validates that 'task_name' is a string (optional), and 'completed' is a boolean (optional).
 *
 * @function
 * @name validateUpdateDaily
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateDaily = [
    /**
     * Optionally validates that 'task_name' is a string and is not empty.
     * @name body('task_name')
     * @type {Validator}
     * @description 'task_name' must be a non-empty string if provided.
     */
    body('task_name')
        .optional()
        .isString()
        .withMessage('task Name must be a string')
        .notEmpty()
        .withMessage('task Name is required'),

    /**
         * Optionally validates that 'completed' is a boolean.
         * @name body('completed')
         * @type {Validator}
         * @description 'completed' must be a boolean value if provided.
         */
    body('completed')
        .optional()
        .isBoolean()
        .withMessage("Completed must be a boolean"),


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



module.exports = {
    validateDaily,
    validateDailyId,
    validateUpdateDaily
};

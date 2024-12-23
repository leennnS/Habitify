const { body, param, validationResult } = require('express-validator');
/**
 * Validation middleware for validating the 'streak' ID parameter in the request.
 * Validates that the 'id' parameter is an integer.
 *
 * @function
 * @name validateStreakId
 * @returns {array} An array of validation middlewares.
 */
const validateStreakId = [
/**
     * Validates that the 'id' parameter is an integer.
     * @name param('id')
     * @type {Validator}
     * @description The 'id' parameter must be an integer.
     */
    param('id').isInt().withMessage('streak Id must be an integer'),
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
 * Validation middleware for validating the 'streak' data in the request body.
 * Validates that 'user_id' is an integer and is not empty.
 *
 * @function
 * @name validateStreak
 * @returns {array} An array of validation middlewares.
 */
const validateStreak = [
/**
     * Validates the 'user_id' field.
     * @name body('user_id')
     * @type {Validator}
     * @description 'user_id' must be an integer and cannot be empty.
     */
    body('user_id')
        .isInt()
        .withMessage('User ID must be an integer')
        .notEmpty()
        .withMessage('user id is required'),
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
    validateStreakId,
    validateStreak
};
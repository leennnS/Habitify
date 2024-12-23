const { body, param, validationResult } = require('express-validator');
/**
 * Validation middleware for creating a new badge.
 * Validates that 'user_id' is an integer, is not empty, that 'badge_name' is a non-empty string,
 * and optionally validates 'badge_description' as a string.
 *
 * @function
 * @name validateBadge
 * @returns {array} An array of validation middlewares.
 */
const validateBadge = [
    /**
      * Validates that 'user_id' is an integer and is not empty.
      * @name body('user_id')
      * @type {Validator}
      * @description 'user_id' must be an integer and cannot be empty.
      */
    body('user_id')
        .isInt()
        .withMessage('User ID must be an integer')
        .notEmpty()
        .withMessage('User ID is required'),

    /**
    * Validates that 'badge_name' is a non-empty string.
    * @name body('badge_name')
    * @type {Validator}
    * @description 'badge_name' must be a non-empty string.
    */
    body('badge_name')
        .isString()
        .withMessage('Badge name must be a string')
        .notEmpty()
        .withMessage('Badge name is required'),
    /**
         * Optionally validates that 'badge_description' is a string.
         * @name body('badge_description')
         * @type {Validator}
         * @description 'badge_description' must be a string if provided.
         */
    body('badge_description')
        .optional()
        .isString()
        .withMessage("badge description must be a String"),
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
 * Validation middleware for validating the 'id' parameter of a badge.
 * Ensures that the 'id' is an integer.
 *
 * @function
 * @name validateBadgeId
 * @returns {array} An array of validation middlewares.
 */
const validateBadgeId = [
    /**
         * Validates that the 'id' parameter is an integer.
         * @name param('id')
         * @type {Validator}
         * @description 'id' must be an integer.
         */
    param('id')
        .isInt()
        .withMessage('badge id must be an integer'),
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
 * Validation middleware for updating an existing badge.
 * Optionally validates that 'badge_name' and 'badge_description' are strings.
 *
 * @function
 * @name validateupdateBadge
 * @returns {array} An array of validation middlewares.
 */
const validateupdateBadge = [
    /**
     * Optionally validates that 'badge_name' is a string.
     * @name body('badge_name')
     * @type {Validator}
     * @description 'badge_name' must be a string if provided.
     */
    body('badge_name')
        .optional()
        .isString()
        .withMessage("badge name must be a String"),

    /**
         * Optionally validates that 'badge_description' is a string.
         * @name body('badge_description')
         * @type {Validator}
         * @description 'badge_description' must be a string if provided.
         */
    body('badge_description')
        .optional()
        .isString()
        .withMessage("badge description must be a String"),
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
    validateBadge,
    validateBadgeId,
    validateupdateBadge
};
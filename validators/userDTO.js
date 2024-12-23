const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for creating a new user.
 * Validates the 'name', 'email', 'password', 'profile_picture' fields.
 * 
 * @function
 * @name validateUser
 * @returns {array} An array of validation middlewares.
 */

const validateUser = [
    /**
   * Validates the 'name' field.
   * @name body('name')
   * @type {Validator}
   * @description Must be a non-empty string.
   */
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name is required'),
    /**
       * Validates the 'email' field.
       * @name body('email')
       * @type {Validator}
       * @description Must be a valid email address.
       */
    body('email')
        .isEmail()
        .withMessage('Email must be valid')
        .notEmpty()
        .withMessage('Email is required'),
    /**
       * Validates the 'password' field.
       * @name body('password')
       * @type {Validator}
       * @description Must be at least 6 characters long.
       */
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    /**
       * Validates the 'profile_picture' field.
       * @name body('profile_picture')
       * @type {Validator}
       * @description Must be a string if provided.
       */
    body('profile_picture')
        .optional()
        .isString()
        .withMessage('Profile picture must be a string'),

    /**
    * Validation result handler.
    * Checks if there are validation errors, returns 400 with the error array.
    */

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserId = [
    /**
 * Validation middleware for validating a user ID.
 * Validates the 'id' parameter to be an integer.
 * 
 * @function
 * @name validateUserId
 * @returns {array} An array of validation middlewares.
 */
    param('id')
        .isInt()
        .withMessage('user id  must be an integer')
        .notEmpty()
        .withMessage('user id is required'),

    /**
       * Validation result handler for user ID validation.
       * Checks for errors and returns a 400 if any validation error occurs.
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
 * Validation middleware for updating an existing user.
 * Validates the 'name', 'email', 'password', 'profile_picture' fields, all of which are optional.
 * 
 * @function
 * @name validateUpdateUser
 * @returns {array} An array of validation middlewares.
 */
const validateUpdateUser = [
    /**
    * Validates the 'name' field.
    * @name body('name')
    * @type {Validator}
    * @description Must be a string if provided.
    */

    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),

    /**
       * Validates the 'email' field.
       * @name body('email')
       * @type {Validator}
       * @description Must be a valid email if provided.
       */
    body('email')
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage('Email must be valid')
        .withMessage('Email is required'),
    /**
       * Validates the 'password' field.
       * @name body('password')
       * @type {Validator}
       * @description Must be a string and at least 6 characters if provided.
       */
    body('password')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    /**
       * Validates the 'profile_picture' field.
       * @name body('profile_picture')
       * @type {Validator}
       * @description Must be a string if provided.
       */
    body('profile_picture')
        .optional()
        .isString()
        .withMessage('Profile picture must be a string'),

    /**
  * Validation result handler for update validation.
  * Checks for errors and returns a 400 if any validation error occurs.
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
    validateUser,
    validateUserId,
    validateUpdateUser
};

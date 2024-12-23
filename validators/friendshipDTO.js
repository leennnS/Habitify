const { body, param, validationResult } = require('express-validator');
/**
 * Validation middleware for validating the friendship ID parameter in the request.
 * Validates that the 'id' parameter is an integer and is required.
 *
 * @function
 * @name validateFriendshipId
 * @returns {array} An array of validation middlewares.
 */
const validateFriendshipId = [
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
        .withMessage('id is required'),
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
 * Validation middleware for creating a new friendship.
 * Validates that 'user_id' and 'friend_id' are integers and are required.
 *
 * @function
 * @name validateFriendships
 * @returns {array} An array of validation middlewares.
 */
const validateFriendships = [
    /**
     * Validates that 'user_id' is an integer and is not empty.
     * @name body('user_id')
     * @type {Validator}
     * @description 'user_id' must be an integer and cannot be empty.
     */
    body('user_id')
        .isInt()
        .withMessage('user id must be an integer')
        .notEmpty()
        .withMessage('user id is required'),
    /**
         * Validates that 'friend_id' is an integer and is not empty.
         * @name body('friend_id')
         * @type {Validator}
         * @description 'friend_id' must be an integer and cannot be empty.
         */
    body('friend_id')
        .isInt()
        .withMessage('friend Id must be an integer')
        .notEmpty()
        .withMessage('friend id is required'),
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
 * Validation middleware for updating the status of an existing friendship.
 * Validates that 'status' is either 'pending' or 'accepted'.
 *
 * @function
 * @name validateupdateFriendship
 * @returns {array} An array of validation middlewares.
 */
const validateupdateFriendship = [
    /**
         * Validates that 'status' is either 'pending' or 'accepted'.
         * @name body('status')
         * @type {Validator}
         * @description 'status' must be one of the predefined values: 'pending' or 'accepted'.
         */
    body('status')
        .isIn(['pending', 'accepted'])
        .withMessage("Status must be 'pending' or 'accepted'"),
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
    validateFriendshipId,
    validateFriendships,
    validateupdateFriendship
};


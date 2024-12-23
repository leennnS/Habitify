const express = require('express');
const badgeController = require('../controllers/badgeController');
const { validateBadge, validateBadgeId, validateupdateBadge } = require('../validators/badgeDTO');
const { validateUserId } = require('../validators/userDTO');

const router = express.Router();
/**
 * GET /badges
 * Fetch all badges in the system.
 * @route GET /badges
 * @returns {Array<Badge>} 200 - List of all badges
 * @throws {Error} 500 - If an error occurs fetching badges
 */
router.get('/', (req, res) => badgeController.getAllBadges(req, res));
/**
 * GET /badges/:id
 * Fetch a specific badge by its ID.
 * @route GET /badges/:id
 * @param {string} id.path - Badge ID
 * @returns {Badge} 200 - The badge object
 * @throws {Error} 400 - Invalid Badge ID
 * @throws {Error} 404 - Badge not found
 */
router.get('/:id', validateBadgeId, (req, res) => badgeController.getBadgeById(req, res));
/**
 * GET /badges/users/:id
 * Fetch all badges earned by a specific user by user ID.
 * @route GET /badges/users/:id
 * @param {string} id.path - User ID
 * @returns {Array<Badge>} 200 - List of badges earned by the user
 * @throws {Error} 400 - Invalid User ID
 * @throws {Error} 404 - User not found
 */
router.get('/users/:id', validateUserId, (req, res) => badgeController.getAllBadgesByUserId(req, res));
/**
 * POST /badges
 * Create a new badge.
 * @route POST /badges
 * @param {Badge} badge.body - Badge data
 * @returns {Badge} 201 - The newly created badge
 * @throws {Error} 400 - Invalid badge data
 */
router.post('/', validateBadge, (req, res) => badgeController.createBadge(req, res));
/**
 * PUT /badges/:id
 * Update a badge by its ID.
 * @route PUT /badges/:id
 * @param {string} id.path - Badge ID
 * @param {BadgeUpdate} badge.body - Updated badge data
 * @returns {Badge} 200 - Updated badge
 * @throws {Error} 400 - Invalid Badge ID or update data
 * @throws {Error} 404 - Badge not found
 */
router.put('/:id', validateBadgeId, validateupdateBadge, (req, res) => badgeController.updateBadge(req, res));
/**
 * DELETE /badges/:id
 * Delete a badge by its ID.
 * @route DELETE /badges/:id
 * @param {string} id.path - Badge ID
 * @returns {boolean} 200 - Success status (true if deleted)
 * @throws {Error} 400 - Invalid Badge ID
 * @throws {Error} 404 - Badge not found
 */
router.delete('/:id', validateBadgeId, (req, res) => badgeController.deleteBadge(req, res));

module.exports = router;
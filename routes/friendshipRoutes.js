const express = require('express');
const friendshipController = require('../controllers/FriendshipController');
const { validateUserId } = require('../validators/userDTO');
const { validateFriendshipId, validateFriendships, validateupdateFriendship } = require('../validators/friendshipDTO');

const router = express.Router();
/**
 * GET /friendships
 * Fetch all friendships in the system.
 * @route GET /friendships
 * @returns {Array<Friendship>} 200 - List of friendships
 * @throws {Error} 500 - If an error occurs fetching the friendships
 */
router.get('/', (req, res) => friendshipController.getAllFriendships(req, res));
/**
 * GET /friendships/:id/search
 * Search for a friend by user ID.
 * @route GET /friendships/:id/search
 * @param {string} id.path - User ID
 * @returns {Array<Friend>} 200 - List of friends
 * @throws {Error} 400 - Invalid User ID
 * @throws {Error} 500 - If an error occurs while searching
 */
router.get('/:id/search', validateUserId, (req, res) => friendshipController.searchFriend(req, res));
/**
 * GET /friendships/:id
 * Fetch a friendship by its ID.
 * @route GET /friendships/:id
 * @param {string} id.path - Friendship ID
 * @returns {Friendship} 200 - The friendship object
 * @throws {Error} 400 - Invalid Friendship ID
 * @throws {Error} 404 - Friendship not found
 */
router.get('/:id', validateFriendshipId, (req, res) => friendshipController.getFriendshipById(req, res));
/**
 * GET /friendships/friends/:id
 * Get the list of friends for a given user.
 * @route GET /friendships/friends/:id
 * @param {string} id.path - User ID
 * @returns {Array<Friend>} 200 - List of friends
 * @throws {Error} 400 - Invalid User ID
 * @throws {Error} 500 - If an error occurs fetching friends
 */
router.get('/friends/:id', validateUserId, (req, res) => friendshipController.getFriends(req, res));
/**
 * GET /friendships/pending/:id
 * Get the list of pending friend requests for a user.
 * @route GET /friendships/pending/:id
 * @param {string} id.path - User ID
 * @returns {Array<Friendship>} 200 - List of pending requests
 * @throws {Error} 400 - Invalid User ID
 * @throws {Error} 500 - If an error occurs fetching pending requests
 */
router.get('/pending/:id', validateUserId, (req, res) => friendshipController.getPendingRequests(req, res));
/**
 * POST /friendships
 * Create a new friendship request.
 * @route POST /friendships
 * @param {Friendship} friendship.body - Friendship data (user_id and friend_id)
 * @returns {Friendship} 201 - The newly created friendship
 * @throws {Error} 400 - Invalid friendship data
 */
router.post('/', validateFriendships, (req, res) => friendshipController.createFriendship(req, res));
/**
 * PUT /friendships/:id
 * Update the status of a friendship (accept/reject).
 * @route PUT /friendships/:id
 * @param {string} id.path - Friendship ID
 * @param {FriendshipStatus} friendship.body - New status of the friendship
 * @returns {Friendship} 200 - Updated friendship status
 * @throws {Error} 400 - Invalid Friendship ID or status
 */
router.put('/:id', validateFriendshipId, validateupdateFriendship, (req, res) => friendshipController.updateFriendshipStatus(req, res));
/**
 * DELETE /friendships/:id
 * Delete a friendship.
 * @route DELETE /friendships/:id
 * @param {string} id.path - Friendship ID
 * @returns {boolean} 200 - Success status (true if deleted)
 * @throws {Error} 400 - Invalid Friendship ID
 * @throws {Error} 404 - Friendship not found
 */
router.delete('/:id', validateFriendshipId, (req, res) => friendshipController.deleteFriendship(req, res));
/**
 * DELETE /friendships/rejectfriendrequest/:friendship_id
 * Reject a friendship request by its ID.
 * @route DELETE /friendships/rejectfriendrequest/:friendship_id
 * @param {string} friendship_id.path - Friendship request ID
 * @returns {boolean} 200 - Success status (true if rejected)
 * @throws {Error} 400 - Invalid Friendship ID
 */
router.get('/rejectfriendrequest/:friendship_id', (req, res) => friendshipController.rejectFriendRequest(req, res));
/**
 * PUT /friendships/acceptfriendrequest/:friendship_id
 * Accept a friendship request by its ID.
 * @route PUT /friendships/acceptfriendrequest/:friendship_id
 * @param {string} friendship_id.path - Friendship request ID
 * @returns {boolean} 200 - Success status (true if accepted)
 * @throws {Error} 400 - Invalid Friendship ID
 */
router.get('/acceptfriendrequest/:friendship_id', (req, res) => friendshipController.acceptFriendRequest(req, res));
/**
 * POST /friendships/sendfriendrequest
 * Send a friendship request.
 * @route POST /friendships/sendfriendrequest
 * @param {Friendship} friendship.body - Friendship data (user_id and friend_id)
 * @returns {boolean} 200 - Success status (true if request sent)
 * @throws {Error} 400 - Invalid friendship data
 */
router.post('/sendfriendrequest', validateFriendships, (req, res) => friendshipController.sendFriendRequest(req, res));

module.exports = router;

const friendshipService = require('../services/friendshipService');

class FriendshipController {

    /**
      * Fetches all friendships.
      * @async
      * @param {Object} req - The request object.
      * @param {Object} res - The response object.
      * @returns {void} - Sends a JSON response with all friendships or an error message.
      */
    async getAllFriendships(req, res) {
        try {
            const friendships = await friendshipService.getAllFriendships();
            res.status(200).json(friendships);
        } catch (error) {

            res.status(500).json({ message: 'Failed to fetch friendships' });
        }
    }
    /**
     * Searches for a friend by user ID and keyword.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the friend or an error message.
     */
    async searchFriend(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { q: keyword } = req.query;
            if (!keyword) {
                return res.status(400).json({ message: 'Search keyword is required' });
            }

            const friend = await friendshipService.searchFriend(id, keyword);

            if (!friend)
                return res.status(404).json({ message: 'friend not found' })

            res.status(200).json(friend);
        } catch (error) {
            res.status(500).json({ message: 'Error searching friend' });
        }
    }
    /**
         * Fetches a friendship by ID.
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with the friendship or an error message.
         */
    async getFriendshipById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const friendship = await friendshipService.getFriendshipById(id);

            if (!friendship)
                return res.status(404).json({ message: 'friendship not found' });

            res.json(friendship);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
        * Fetches all friends for a specific user.
        * @async
        * @param {Object} req - The request object.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response with friends or an error message.
        */
    async getFriends(req, res) {
        try {
            const user_id = parseInt(req.params.id, 10)
            const friends = await friendshipService.getFriends(user_id);

            if (!friends) {
                return res.status(404).json({ message: 'friends not found' })
            }
            console.log(friends);
            res.render('friends', { friends });

        } catch (error) {

            res.status(500).json({ message: 'Failed to fetch friends' });
        }
    }

    /**
         * Creates a new friendship.
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with the new friendship or an error message.
         */
    async createFriendship(req, res) {
        try {
            const { user_id, friend_id } = req.body;
            const newFriendship = await friendshipService.createFriendship({ user_id, friend_id });

            if (!newFriendship)
                return res.status(404).json({ message: 'Failed to create friendship' });

            res.status(201).json(newFriendship);

        } catch (error) {
            if (error.message.includes('does not exist'))
                return res.status(400).json({ message: error.message })
            if (error.message.includes('already exists'))
                return res.status(500).json({ message: 'Friendship already exists' })
            if (error.message.includes('yourself'))
                return res.status(500).json({ message: 'Cant create friendship with yourself' })

            res.status(500).json({ message: 'Failed to create friendship' });
        }
    }
    /**
     * Updates the status of a friendship.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response confirming the update or an error message.
     */
    async updateFriendshipStatus(req, res) {
        try {
            const friendship_id = parseInt(req.params.id, 10)
            const { status } = req.body;
            const updated = await friendshipService.updateFriendship(friendship_id, { status });

            if (!updated)
                return res.status(404).json({ message: 'Friendship not found or status unchanged' });

            res.status(200).json({ message: 'Friendship status updated successfully' });

        } catch (error) {
            if (error.message.includes('Invalid status'))
                return res.status(400).json({ message: error.message })

            res.status(500).json({ message: 'Failed to update friendship status' });
        }
    }
    /**
        * Fetches pending friend requests for a user.
        * @async
        * @param {Object} req - The request object.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response with pending requests or an error message.
        */
    async getPendingRequests(req, res) {
        try {
            const user_id = parseInt(req.params.id, 10)
            const pendingRequests = await friendshipService.getPendingRequests(user_id);

            if (!pendingRequests || pendingRequests.length === 0)
                return res.status(404).json({ message: 'No pending requests found' });

            res.redirect('/friends');

        } catch (error) {

            res.status(500).json({ message: 'Failed to fetch pending requests' });
        }
    }
    /**
        * Deletes a friendship by ID.
        * @async
        * @param {Object} req - The request object.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response confirming the deletion or an error message.
        */
    async deleteFriendship(req, res) {
        try {
            const id = parseInt(req.params.id, 10);

            const deleted = await friendshipService.deleteFriendship(id);

            if (!deleted)
                return res.status(404).json({ message: 'Friendship not found' });

            res.status(200).json({ message: 'Friendship deleted successfully' });

        } catch (error) {

            res.status(500).json({ message: 'Failed to delete friendship' });
        }
    }

    /**
         * Sends a friend request.
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response confirming the friend request or an error message.
         */
    async sendFriendRequest(req, res) {
        try {
            const { user_id, friend_id } = req.body;
            const result = await friendshipService.sendFriendRequest({ user_id, friend_id });
            res.redirect('/UserDashBoard');
        } catch (error) {

            res.redirect('/UserDashboard');
        }
    }
    /**
        * Accepts a friend request by friendship ID.
        * @async
        * @param {Object} req - The request object.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response confirming acceptance or an error message.
        */
    async acceptFriendRequest(req, res) {
        try {
            const { friendship_id } = req.params;
            const result = await friendshipService.acceptFriendRequest(friendship_id);

            res.redirect('/friends');
        } catch (error) {

            res.status(500).json({ message: error.message });
        }
    }
    /**
         * Rejects a friend request by friendship ID.
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response confirming rejection or an error message.
         */
    async rejectFriendRequest(req, res) {
        try {
            const { friendship_id } = req.params;
            const result = await friendshipService.rejectFriendRequest(friendship_id);

            res.redirect('/friends');
        } catch (error) {

            res.status(500).json({ message: error.message });
        }
    }


}

module.exports = new FriendshipController();




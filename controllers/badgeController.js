const badgeService = require('../services/badgeService');

class BadgeController {
    /**
         * Fetches all badges.
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with all badges or an error message.
         */
    async getAllBadges(req, res) {
        try {
            const badge = await badgeService.getAllBadges();
            res.json(badge);
        } catch (error) {

            res.status(500).json({ message: 'Internal server error ' });

        }
    }
    /**
     * Fetches all badges for a specific user by user ID.
     * @async
     * @param {Object} req - The request object containing the user ID.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the user's badges or an error message.
     */
    async getAllBadgesByUserId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const badge = await badgeService.getAllBadgesByUserId(id);

            if (!badge)
                return res.status(404).json({ message: 'badges not found' });

            res.json(badge);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
        * Fetches a badge by its ID.
        * @async
        * @param {Object} req - The request object containing the badge ID.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response with the badge or an error message.
        */
    async getBadgeById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const badge = await badgeService.getBadgeById(id);

            if (!badge)
                return res.status(404).json({ message: 'badge not found' });

            res.json(badge);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
         * Creates a new badge.
         * @async
         * @param {Object} req - The request object containing user ID, badge name, and badge description.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with the created badge or an error message.
         */
    async createBadge(req, res) {
        try {
            const { user_id, badge_name, badge_description } = req.body;
            const newBadge = await badgeService.createBadge({ user_id, badge_name, badge_description });

            if (!newBadge) {
                return res.status(404).json({ message: 'user not found ' })
            }
            res.status(201).json(newBadge);
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });

        }
    }
    /**
        * Updates an existing badge by ID.
        * @async
        * @param {Object} req - The request object containing the badge ID and updated fields.
        * @param {Object} res - The response object.
        * @returns {void} - Sends a JSON response with a success message or an error message.
        */
    async updateBadge(req, res) {
        try {
            const { badge_name, badge_description } = req.body;
            const id = parseInt(req.params.id, 10);

            if (!badge_name && !badge_description) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            const updatedBadge = await badgeService.updateBadge(id, { badge_name, badge_description });

            if (!updatedBadge) {
                res.status(404).json({ message: 'Badge not found or no changes made' });
            }
            res.json({ message: 'badge updated successfully' });

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
         * Deletes a badge by ID.
         * @async
         * @param {Object} req - The request object containing the badge ID.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with a success message or an error message.
         */
    async deleteBadge(req, res) {
        try {
            const id = parseInt(req.params.id, 10);

            const deletedBadge = await badgeService.deleteBadge(id);

            if (!deletedBadge)
                return res.status(404).json({ message: 'badge not found' });

            res.json({ message: 'badge deleted successfully' });
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = new BadgeController();


const streakService = require('../services/streakService');

/**
 * @class StreakController
 * @description Handles the requests related to streaks, including fetching, creating, updating, and deleting streaks.
 */
class StreakController {
    /**
    * Fetches all streaks.
    * @async
    * @param {Object} req - The request object.
    * @param {Object} res - The response object.
    * @returns {void} - Sends a JSON response with all streaks or an error message.
    */
    async getAllstreaks(req, res) {
        try {
            const streak = await streakService.getAllStreaks();
            res.json(streak)
        } catch (error) {

            res.status(500).json({ message: 'Internal server error ' });

        }
    }
    /**
     * Fetches a specific streak by its ID.
     * @async
     * @param {Object} req - The request object containing the streak ID in params.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the requested streak or an error message.
     */
    async getStreakById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const streak = await streakService.getStreakById(id);

            if (!streak)
                return res.status(404).json({ message: 'streak not found' });

            res.json(streak);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * Fetches streaks associated with a specific user by user ID.
     * @async
     * @param {Object} req - The request object containing the user ID in params.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the user's streaks or an error message.
     */
    async getStreakByUserId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const streak = await streakService.getStreakByUserId(id);

            if (!streak)
                return res.status(404).json({ message: 'streak not found' });

            res.json(streak);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }


    /**
    * Creates a new streak for a user.
    * @async
    * @param {Object} req - The request object containing the user ID in the body.
    * @param {Object} res - The response object.
    * @returns {void} - Sends a JSON response with the newly created streak or an error message.
    */
    async createStreak(req, res) {
        try {
            const { user_id } = req.body;
            const newStreak = await streakService.createStreak({ user_id });
            res.status(201).json(newStreak);
        } catch (error) {
            if (error.message.includes('already exists'))
                return res.status(400).json({ message: error.message })
            res.status(500).json({ message: 'Internal server error' });

        }
    }
    /**
     * Updates an existing streak by ID.
     * @async
     * @param {Object} req - The request object containing the streak ID in params and updated data in the body.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response indicating success or failure.
     */
    async updateStreak(req, res) {
        try {

            const user_id = parseInt(req.params.id, 10);
            const updatedStreak = await streakService.updateStreak(user_id);

            if (!updatedStreak) {
                return res.status(404).json({ message: 'streak not found or no changes made' });
            }
            res.json({ message: 'streak updated successfully,streak count increased' });

        } catch (error) {
            if (error.message.includes('streak up to date')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * Deletes a specific streak by ID.
     * @async
     * @param {Object} req - The request object containing the streak ID in params.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response indicating success or failure.
     */
    async deleteStreak(req, res) {
        try {
            const id = parseInt(req.params.id, 10);

            const deletedStreak = await streakService.deleteStreak(id);

            if (!deletedStreak)
                return res.status(404).json({ message: 'streak not found' });

            res.json({ message: 'streak deleted successfully' });
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = new StreakController();
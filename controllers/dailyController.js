const dailyService = require('../services/dailyService');

class DailyController {
    /**
     * Fetches all dailies.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with all dailies or an error message.
     */
    async getAllDailies(req, res) {
        try {

            const daily = await dailyService.getAllDailies();
            res.json(daily);
        } catch (error) {

            res.status(500).json({ message: 'Internal server error ' });

        }
    }
    /**
         * Fetches a daily by ID.
         * @async
         * @param {Object} req - The request object containing the daily ID.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with the daily or an error message.
         */
    async getDailyById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const daily = await dailyService.getDailyById(id);

            if (!daily)
                return res.status(404).json({ message: 'daily not found' });

            res.json(daily);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
         * Fetches all dailies for a specific user by user ID.
         * @async
         * @param {Object} req - The request object containing the user ID.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with the user's dailies or an error message.
         */
    async getDailyByUserId(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                return res.status(404).json({ message: 'user id not found' })
            }
            const daily = await dailyService.getDailyByUserId(id);

            if (!daily)
                return res.status(404).json({ message: 'daily not found' });

            res.json(daily);

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
         * Creates a new daily task.
         * @async
         * @param {Object} req - The request object containing the user ID and task name.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with the created daily or an error message.
         */

    async createDaily(req, res) {
        try {
            const { user_id, task_name } = req.body;
            const newDaily = await dailyService.createDaily({ user_id, task_name });

            if (!newDaily) {
                return res.status(404).json({ message: 'user id not found' });
            }

            /* res.render('UserDashboard', {
                 userId: user_id,    // Include userId   
                 dailies: newDaily      // Updated habits
             });*/
            res.redirect('/UserDashboard');

        } catch (error) {
            if (error.message.includes('already exists'))
                return res.status(400).json({ message: error.message })

            if (error.message.includes('not found'))
                res.status(400).json({ message: error.message })

            res.status(500).json({ message: 'Internal server error' });

        }
    }
    /**
         * Updates a daily task by ID.
         * @async
         * @param {Object} req - The request object containing the daily ID and updated fields.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with a success message or an error message.
         */
    async updateDaily(req, res) {
        try {
            const { task_name, completed } = req.body;
            const id = parseInt(req.params.id, 10);
            const updatedDaily = await dailyService.updateDaily(id, { task_name, completed });
            if (!updatedDaily) {
                return res.status(404).json({ message: 'Daily not found or no changes made' });
            }

            req.flash('success', 'Wohoo,Daily completed');
            return res.redirect('/UserDashboard');

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
         * Deletes a daily task by ID.
         * @async
         * @param {Object} req - The request object containing the daily ID.
         * @param {Object} res - The response object.
         * @returns {void} - Sends a JSON response with a success message or an error message.
         */
    async deleteDaily(req, res) {
        try {
            const id = parseInt(req.params.id, 10);

            const deletedDaily = await dailyService.deleteDaily(id);

            if (!deletedDaily)
                res.status(404).json({ message: 'daily not found' });

            req.flash('success', 'oops...Daily deleted')
            res.redirect('/UserDashboard');
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = new DailyController();
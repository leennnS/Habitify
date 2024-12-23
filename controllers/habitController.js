const habitService = require('../services/habitService');

class HabitController {
    /**
 * @class HabitController
 * @description Handles the requests related to habits, including fetching, creating, updating, and deleting habits.
 */
    /**
      * Fetches all habits.
      * @async
      * @param {Object} req - The request object.
      * @param {Object} res - The response object.
      * @returns {void} - Sends a JSON response with all habits or an error message.
      */
    async getAllHabits(req, res) {

        try {
            const habits = await habitService.getAllHabits();
            console.log(habits);
            res.render('UserDashboard', { title: 'Habits', habits: habits || [] });
        } catch (error) {

            res.status(500).json({ message: 'Internal server error ' });

        }
    }
    /**
     * Fetches a habit by its ID.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the habit or an error message.
     */
    async getHabitById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const habit = await habitService.getHabitById(id);

            if (!habit)
                return res.status(404).json({ message: 'Habit not found' });

            res.json(habit);
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * Fetches all habits for a specific user by user ID.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the user's habits or an error message.
     */
    async getAllHabitsByUserId(req, res) {
        try {
            const user_id = parseInt(req.params.id, 10);
            const habits = await habitService.getAllHabitsByUserId(user_id); // Call the correct service function

            if (!habits || habits.length === 0) // Check if habits array is empty
                return res.status(404).json({ message: 'Habits not found' });

            //res.render('UserDashboard', { habits });
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
     * Creates a new habit.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response with the created habit or an error message.
     */
    async createHabit(req, res) {
        try {
            const { habit_name } = req.body;
            const user_id = req.session.user.user_id;

            // Call the habitService to create the habit
            const newHabit = await habitService.createHabit({ user_id, habit_name });

            if (!newHabit) {
                return res.status(404).json({ message: 'User not found' });
            }

            // After creating the new habit, fetch all habits for the user
            const habits = await habitService.getAllHabitsByUserId(user_id);

            // Render the UserDashboard EJS with the updated habits
            /* res.render('UserDashboard', {
                 userId: user_id,    // Include userId
                 title: 'Habits',    // Include title
                 habits: habits      // Updated habits
             });*/
            req.flash('success', 'new Habit added, Good Job!')
            res.redirect('/UserDashboard');

        } catch (error) {
            console.error('Error creating habit:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates an existing habit by its ID.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response confirming the update or an error message.
     */
    async updateHabit(req, res) {
        try {
            const { habit_name } = req.body;
            const id = parseInt(req.params.id, 10);
            const updatedHabit = await habitService.updateHabit(id, { habit_name });

            if (!updatedHabit) {
                return res.status(404).json({ message: 'Habit not found or no changes made' });
            }
            res.json({ message: 'Habit updated successfully' });

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }
    /**
 * Controller method to mark a habit as completed.
 * It interacts with the `habitService.markHabitAsCompleted` method to update the habit and increment points.
 * @param {Object} req - The request object, should include the habit ID in the request parameters.
 * @param {Object} res - The response object.
 */
    async markHabitAsCompletedController(req, res) {

        const habitId = parseInt(req.params.id, 10);

        try {
            // Call the service to mark the habit as completed and increment points
            const success = await habitService.markHabitAsCompleted(habitId);

            if (success) {
                req.flash('success', 'Habit marked as completed and points incremented.');
                return res.redirect('/UserDashboard');
            } else {
                req.flash('error', 'Habit not found or couldn\'t be updated.');
                return res.redirect('/UserDashboard');
            }
        } catch (error) {
            if (error.message.includes('already completed')) {
                req.flash('error', 'Habit is already completed.');
                return res.redirect('/UserDashboard');
            }
            if (error.message.includes('not found')) {
                req.flash('error', 'Habit not found or not updated.');
                return res.redirect('/UserDashboard');
            }
            req.flash('error', 'An error occurred while updating the habit.');
            return res.redirect('/UserDashboard');
        }
    }
    /**
     * Deletes a habit by its ID.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {void} - Sends a JSON response confirming the deletion or an error message.
     */
    async deleteHabit(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const deletedHabit = await habitService.deleteHabit(id);

            if (!deletedHabit)
                return res.status(404).json({ message: 'habit not found' });

            req.flash('success', 'oopss..Habit deleted');
            res.redirect('/UserDashboard');
        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = new HabitController();
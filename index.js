const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const habitService = require('./services/habitService')
const badgeRoutes = require('./routes/badgeRoutes');
const dailyRoutes = require('./routes/dailyRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const friendshipService = require('./services/friendshipService');
const streakRoutes = require('./routes/streakRoutes');
const session = require('express-session');
const jwt = require('jsonwebtoken'); // Import JWT library
const ejs = require("ejs");
const flash = require('connect-flash');
//Load environment variables from .env file
dotenv.config();

/**
 * @constant {express.Application} app - Express application instance.
 */
const app = express();

const path = require('path');
const dailyService = require('./services/dailyService');
const { LOADIPHLPAPI } = require('dns');
const userService = require('./services/userService');
const badgeService = require('./services/badgeService');
const streakService = require('./services/streakService');
app.use(session({
  secret: 'helpmepls',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.use(flash());

app.use((req, res, next) => {
  res.locals.message = req.flash('message'); // Make flash message available in views
  next();
});

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});
app.get('/search', async (req, res) => {
  // const loggedId = req.session.user.user_id;
  const userId = req.session.user.user_id;
  const user = req.session.user;
  console.log(user);
  const streak = await streakService.getStreakByUserId(userId);
  res.render('search', { user, userId, streak });
});

app.get('/friends', async (req, res) => {
  const userId = req.session.user.user_id;
  const loggedId = req.session.user.user_id;
  const friends = await friendshipService.getFriends(userId);
  const pendingRequests = await friendshipService.getPendingRequests(loggedId);
  const streak = await streakService.getStreakByUserId(userId);
  res.render('friends', { friends, loggedId, userId, user: req.session.user, pendingRequests, streak });
});

app.get('/profile/update/:id', async (req, res) => {
  res.render('editUser', { user: req.session.user });
});

/*app.get('/editUser', (req, res) => {
  res.render('editUser');
});*/

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.redirect('/'); // Optional: Redirect to the homepage even if an error occurs
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/login'); // Redirect to the login page or any other desired page
  });
});
/**
 * Middleware to parse incoming JSON request bodies.
 * @function
 */
app.use(express.json());

/**
 * Route handler for user-related routes.
 * @name use
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} '/api/users' - The route for handling user-related requests.
 * @param {module:routes/userRoutes} userRoutes - The user routes module.
 */
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile/:id', async (req, res) => {
  const id = req.params.id;
  const loggedId = req.session.user.user_id;
  const userId = req.session.user.user_id;
  const user = await userService.getUserById(id);
  const username = req.session.username;
  const profile_picture = req.session.user.profile_picture;
  const habits = await habitService.getAllHabitsByUserId(id);
  const badges = await badgeService.getAllBadgesByUserId(id);
  const streak = await streakService.getStreakByUserId(userId);
  res.render('profile', { user, username, habits, userId, badges, loggedId: loggedId, streak, profile_picture });
});
/**
 * Route handler for habit-related routes.
 * @name use
 * @function
 * @memberof module:routes/habitRoutes
 * @param {string} '/api/habits' - The route for handling habit-related requests.
 * @param {module:routes/habitRoutes} habitRoutes - The habit routes module.
 */
app.use('/api/habits', habitRoutes);

app.get('/UserDashboard', async (req, res) => {
  const userId = req.session.user.user_id;
  const username = req.session.user.username; // Access the user ID from the session
  const habits = await habitService.getAllHabitsByUserId(userId); // Fetch habits for that user
  const streak = await streakService.getStreakByUserId(userId);
  const dailies = await dailyService.getDailyByUserId(userId);

  res.render('UserDashboard', {
    success: req.flash('success'),
    error: req.flash('error'), userId, user: req.session.user, username, dailies, habits, streak, title: 'Dashboard'
  });
});

/**
 * Route handler for streak-related routes.
 * @name use
 * @function
 * @memberof module:routes/streakRoutes
 * @param {string} '/api/streaks' - The route for handling streak-related requests.
 * @param {module:routes/streakRoutes} streakRoutes - The streak routes module.
 */
app.use('/api/streaks', streakRoutes);

/**
 * Route handler for friendship-related routes.
 * @name use
 * @function
 * @memberof module:routes/friendshipRoutes
 * @param {string} '/api/friendships' - The route for handling friendship-related requests.
 * @param {module:routes/friendshipRoutes} friendshipRoutes - The friendship routes module.
 */
app.use('/api/friendships', friendshipRoutes);

/**
 * Route handler for daily task-related routes.
 * @name use
 * @function
 * @memberof module:routes/dailyRoutes
 * @param {string} '/api/dailies' - The route for handling daily task-related requests.
 * @param {module:routes/dailyRoutes} dailyRoutes - The daily routes module.
 */
app.use('/api/dailies', dailyRoutes);

/**
 * Route handler for badge-related routes.
 * @name use
 * @function
 * @memberof module:routes/badgeRoutes
 * @param {string} '/api/badges' - The route for handling badge-related requests.
 * @param {module:routes/badgeRoutes} badgeRoutes - The badge routes module.
 */
app.use('/api/badges', badgeRoutes);

/**
 * Route handler for the root endpoint. Responds with a welcome message.
 * @name get
 * @function
 * @memberof express.Application
 * @param {string} '/' - The root URL.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get('/', (req, res) => {
  res.send('Welcome to the User API');
});

/**
 * Error handling middleware for unhandled errors in the application.
 * @name use
 * @function
 * @memberof express.Application
 * @param {Error} err - The error object.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

/**
 * Starts the server on the specified port.
 * @function
 * @param {number|string} [PORT=3001] - The port on which the server will run. Defaults to 3001.
 * @fires app.listen
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
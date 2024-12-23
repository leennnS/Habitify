

const authenticateSession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).redirect('/login'); // Redirect to login if not authenticated
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports = authenticateSession;

// Check if user is logged in (has a valid session)
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Please login to continue" });
};

module.exports = isAuthenticated;

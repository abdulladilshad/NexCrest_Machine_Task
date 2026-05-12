// Check if logged-in user is an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = isAdmin;

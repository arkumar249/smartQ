// middlewares/authorizeRoles.js
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).send("Access denied. Unauthorized role.");
    }
    next();
  };
}

module.exports = authorizeRoles;

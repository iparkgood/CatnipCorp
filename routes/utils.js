function requireUser(req, res, next) {
  if (!req.user) {
    next({
      error: "Missing User Error",
      message: "You must be logged in to perform this action.",
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    next({
      error: "Not Admin Error",
      message: "You are not allowed to perform this action.",
    });
  }
  next();
}

module.exports = {
  requireUser,
  requireAdmin,
};

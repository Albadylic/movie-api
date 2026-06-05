const db = require("../db");

function requireAdmin(req, res, next) {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(401).json({ error: "userId is required" });
  }

  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId);

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

module.exports = { requireAdmin };

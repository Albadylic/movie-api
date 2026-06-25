const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");

// POST /users
router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  db.get(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, existingUser) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Account already exists for this email" });
      }

      const user = {
        id: randomUUID(),
        name,
        email,
        role: "USER",
        created_at: new Date().toISOString(),
      };

      db.run(
        "INSERT INTO users (id, name, email, role, created_at) VALUES (?, ?, ?, ?, ?)",
        [user.id, user.name, user.email, user.role, user.created_at],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(user);
        },
      );
    },
  );
});

// GET /users/:id
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });
});

module.exports = router;

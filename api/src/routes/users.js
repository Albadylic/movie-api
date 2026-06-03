const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

let users = [];

// POST /users
// * Register a new user
router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name | !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const user = {
    id: randomUUID(),
    name,
    email,
    role: "USER",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  res.status(201).json(user);
});

// GET /users/:id
// * Fetch a user by ID

router.get(":/id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json(user);
});

module.exports = router;

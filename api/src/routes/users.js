const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");
const { z } = require("zod");
const { validate } = require("../middleware/validate");

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// POST /users
// * Register a new user
router.post("/", validate(createUserSchema), (req, res) => {
  const { name, email } = req.body;

  if (!name | !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);
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
    createdAt: new Date().toISOString(),
  };

  db.prepare(
    "INSERT INTO users (id, name, email, role, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(user.id, user.name, user.email, user.role, user.createdAt);

  res.status(201).json(user);
});

// GET /users/:id
// * Fetch a user by ID

router.get("/:id", (req, res) => {
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});

module.exports = router;

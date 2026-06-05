const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");
const { validate } = require("../middleware/validate");
const { createUserSchema } = require("../schemas");
const bcrypt = require("bcrypt");

// POST /users
// * Register a new user
router.post("/", validate(createUserSchema), async (req, res) => {
  const { name, email, password } = req.body;

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

  const passwordHash = await bcrypt.hash(password, 10);

  db.prepare(
    "INSERT INTO users (id, name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(
    user.id,
    user.name,
    user.email,
    passwordHash,
    user.role,
    user.createdAt,
  );

  res.status(201).json(user);
});

// GET /users/:id
// * Fetch a user by ID

router.get("/:id", (req, res) => {
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { password, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");

// GET /movies
// * List all movies
router.get("/", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});

// GET /movies/:id
// * Fetch a movie by ID
router.get("/:id", (req, res) => {
  const movie = db
    .prepare("SELECT * FROM movies WHERE id = ?")
    .get(req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

// TODO: Add route for
// * Get movies by params

// POST /movies
// * Add a movie
router.post("/", (req, res) => {
  const { title, director, year, genre, synopsis } = req.body;

  if (!title || !director || !year || !genre) {
    return res.status(400).json({ error: "Missing data from movie listing" });
  }

  const movie = {
    id: randomUUID(),
    title,
    director,
    year,
    genre,
    synopsis: synopsis || null,
    createdAt: new Date().toISOString(),
  };

  db.prepare(
    "INSERT INTO movies (id, title, director, year, genre, synopsis, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(
    movie.id,
    movie.title,
    movie.director,
    movie.year,
    movie.genre,
    movie.synopsis,
    movie.createdAt,
  );
  res.status(201).json(movie);
});

// PATCH /movies:id
// * Update a movie
router.patch("/:id", (req, res) => {
  const movie = db
    .prepare("SELECT * FROM movies WHERE id = ?")
    .get(req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });

  const updates = { ...movie, ...req.body };
  db.prepare(
    "UPDATE movies SET title=?, director=?, year=?, genre=?, synopsis=? WHERE id=?",
  ).run(
    updates.title,
    updates.director,
    updates.year,
    updates.genre,
    updates.synopsis,
    req.params.id,
  );

  res.json({ ...updates, created_at: movie.created_at });
});

// DELETE /movies/:id
// * Remove a movie
router.delete("/:id", (req, res) => {
  const movie = db
    .prepare("SELECT id FROM movies WHERE id = ?")
    .get(req.params.id);
  if (index === -1) return res.status(404).json({ error: "Movie not found" });
  db.prepare("DELETE FROM movies WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;

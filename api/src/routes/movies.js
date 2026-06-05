const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");
const { validate } = require("../middleware/validate");
const { createMovieSchema, updateMovieSchema } = require("../schemas");
const { requireAdmin } = require("../middleware/requireAdmin");

// better-sqlite3 can only parameterise values (not columns)
// We will whitelist sort fields to prevent injection
const SORTABLE_FIELDS = ["title", "year", "director", "genre"];
const FILTERABLE_FIELDS = ["genre", "director", "year"];

// GET /movies
// * List all movies
// Endpoints look like:
//  GET /movies?genre=Drama&director=Nolan&sort=year&order=desc&page=2&limit=10
router.get("/", (req, res) => {
  const {
    sort = "created_at",
    order = "desc",
    page = 1,
    limit = 20,
    ...filters
  } = req.query;

  const sortCol = SORTABLE_FIELDS.includes(sort) ? sort : "created_at";
  const sortDir = order === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const params = [];

  for (const [key, value] of Object.entries(filters)) {
    if (FILTERABLE_FIELDS.includes(key)) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (Number(page) - 1) * Number(limit);

  const movies = db
    .prepare(
      `SELECT * FROM movies ${where} ORDER BY ${sortCol} ${sortDir} LIMIT ? OFFSET ?`,
    )
    .all(...params, Number(limit), offset);

  const movieCount = db
    .prepare(`SELECT COUNT(*) as total FROM movies ${where}`)
    .get(...params);

  res.json({
    data: movies,
    total: movieCount.total,
    page: Number(page),
    limit: Number(limit),
  });
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

// POST /movies
// * Add a movie
router.post("/", requireAdmin, validate(createMovieSchema), (req, res) => {
  const { title, director, year, genre, synopsis } = req.body;

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
router.patch("/:id", requireAdmin, validate(updateMovieSchema), (req, res) => {
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
router.delete("/:id", requireAdmin, (req, res) => {
  const movie = db
    .prepare("SELECT id FROM movies WHERE id = ?")
    .get(req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  db.prepare("DELETE FROM movies WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;

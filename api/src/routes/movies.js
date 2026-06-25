const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");

// GET /movies
router.get("/", (req, res) => {
  db.all("SELECT * FROM movies", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /movies/:id
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM movies WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Movie not found" });
    res.json(row);
  });
});

// POST /movies
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
    created_at: new Date().toISOString(),
  };

  db.run(
    "INSERT INTO movies (id, title, director, year, genre, synopsis, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      movie.id,
      movie.title,
      movie.director,
      movie.year,
      movie.genre,
      movie.synopsis,
      movie.created_at,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(movie);
    },
  );
});

// PATCH /movies/:id
router.patch("/:id", (req, res) => {
  db.get("SELECT * FROM movies WHERE id = ?", [req.params.id], (err, movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const updates = { ...movie, ...req.body };

    db.run(
      "UPDATE movies SET title=?, director=?, year=?, genre=?, synopsis=? WHERE id=?",
      [
        updates.title,
        updates.director,
        updates.year,
        updates.genre,
        updates.synopsis,
        req.params.id,
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ...updates, created_at: movie.created_at });
      },
    );
  });
});

// DELETE /movies/:id
router.delete("/:id", (req, res) => {
  db.get(
    "SELECT id FROM movies WHERE id = ?",
    [req.params.id],
    (err, movie) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!movie) return res.status(404).json({ error: "Movie not found" });

      db.run("DELETE FROM movies WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
      });
    },
  );
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

let movies = [];

// GET /movies
// * List all movies
router.get("/", (req, res) => {
  res.json(movies);
});

// GET /movies/:id
// * Fetch a movie by ID
router.get("/:id", (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

// POST /movies
// * Add a movie
router.post("/movies", (req, res) => {
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
    createdAt: new Date().toISOString,
  };

  movies.push(movie);
  res.status(201).json(movie);
});

// PATCH /movies:id
// * Update a movie
router.patch("/:id", (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });

  const { title, director, year, genre, synopsis } = req.body;
  if (title) movie.title = title;
  if (director) movie.director = director;
  if (year) movie.year = year;
  if (genre) movie.genre = genre;
  if (synopsis !== undefined) movie.synopsis = synopsis;

  res.json(movie);
});

// DELETE /movies/:id
// * Remove a movie
router.delete("/:id", (req, res) => {
  const index = movies.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Movie not found" });
  movies.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

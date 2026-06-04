const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");

// Get /reviews?movieId=:id
// * Get reviews for a movie
router.get("/", (req, res) => {
  const { movieId } = req.query;
  const reviews = db
    .prepare("SELECT * FROM reviews WHERE movie_id = ?")
    .all(movieId);
  res.json(reviews);
});

// Get /reviews?userId=:id
// * Get reviews for a user
router.get("/", (req, res) => {
  const { userId } = req.query;
  const reviews = db
    .prepare("SELECT * FROM reviews WHERE user_id = ?")
    .all(userId);
  res.json(reviews);
});

// POST /reviews
// * Create a new review
router.post("/", (req, res) => {
  const { userId, movieId, rating, comment } = req.body;

  // Check the movie exists
  const movie = db.prepare("SELECT id FROM movies WHERE id = ?").get(movieId);
  if (!movie) return res.status(404).json({ error: "Movie not found" });

  // Check the user exists
  // This can be a challenge
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!userId || !movieId || rating === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const review = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    db.prepare(
      "INSERT INTO reviews (id, movie_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(
      review.id,
      movieId,
      userId,
      rating,
      comment ?? null,
      review.createdAt,
    );
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res
        .status(409)
        .json({ error: "You have already reviewed this movie" });
    } else {
      throw err; // Throw a generic error to the catch-all handler in index.js
    }
  }

  res.status(201).json(review);
});

// PATCH /reviews/:id
// * Update an existing review
router.patch("/:id", (req, res) => {
  const { userId, rating, comment } = req.body;
  const review = db
    .prepare("SELECT * FROM reviews WHERE id = ?")
    .get(req.params.id);

  if (!review) return res.status(404).json({ error: "Review not found" });

  // Ownership check
  if (review.user_id !== userId) {
    return res
      .status(403)
      .json({ error: "You can only update your own reviews" });
  }

  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    review.rating = rating;
  }

  if (comment !== undefined) review.comment = comment;

  db.prepare("UPDATE reviews SET rating=?, comment=? WHERE id=?").run(
    newRating,
    newComment,
    req.params.id,
  );

  res.json(review);
});

// DELETE /reviews/:id
// * Remove a review
router.delete("/:id", (req, res) => {
  const { userId } = req.body;
  const review = db
    .prepare("SELECT * FROM reviews WHERE id = ?")
    .get(req.params.id);

  if (!review) return res.status(404).json({ error: "Review not found" });

  if (review.user_id !== userId) {
    // And the user is not an admin
    return res
      .status(403)
      .json({ error: "You can only delete your own reviews" });
  }

  db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;

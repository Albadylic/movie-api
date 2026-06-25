const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const db = require("../db");

// GET /reviews?movieId=:id
router.get("/", (req, res) => {
  const { movieId } = req.query;
  db.all("SELECT * FROM reviews WHERE movie_id = ?", [movieId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /reviews
router.post("/", (req, res) => {
  const { userId, movieId, rating, comment } = req.body;

  if (!userId || !movieId || rating === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // Check the movie exists
  db.get("SELECT id FROM movies WHERE id = ?", [movieId], (err, movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    // Check the user exists
    db.get("SELECT id FROM users WHERE id = ?", [userId], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User not found" });

      const review = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
      };

      db.run(
        "INSERT INTO reviews (id, movie_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          review.id,
          movieId,
          userId,
          rating,
          comment ?? null,
          review.created_at,
        ],
        (err) => {
          if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
              return res
                .status(409)
                .json({ error: "You have already reviewed this movie" });
            }
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(review);
        },
      );
    });
  });
});

// PATCH /reviews/:id
router.patch("/:id", (req, res) => {
  const { userId, rating, comment } = req.body;

  db.get(
    "SELECT * FROM reviews WHERE id = ?",
    [req.params.id],
    (err, review) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!review) return res.status(404).json({ error: "Review not found" });

      if (review.user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You can only update your own reviews" });
      }

      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      }

      const newRating = rating !== undefined ? rating : review.rating;
      const newComment = comment !== undefined ? comment : review.comment;

      db.run(
        "UPDATE reviews SET rating=?, comment=? WHERE id=?",
        [newRating, newComment, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ ...review, rating: newRating, comment: newComment });
        },
      );
    },
  );
});

// DELETE /reviews/:id
router.delete("/:id", (req, res) => {
  const { userId } = req.body;

  db.get(
    "SELECT * FROM reviews WHERE id = ?",
    [req.params.id],
    (err, review) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!review) return res.status(404).json({ error: "Review not found" });

      if (review.user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You can only delete your own reviews" });
      }

      db.run("DELETE FROM reviews WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
      });
    },
  );
});

module.exports = router;

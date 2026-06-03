const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

let reviews = [];

// Get /reviews?movieId=:id
// * Get reviews for a movie
router.get("/", (req, res) => {
  const { movieId } = req.query;
  const result = movieId
    ? reviews.filter((r) => r.movieId === movieId)
    : reviews;
  res.json(result);
});

// POST /reviews
// * Create a new review
router.post("/", (req, res) => {
  const { userId, movieId, rating, comment } = req.body;

  if (!userId || !movieId || rating === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // A user can review each movie only once
  const existingReview = reviews.find(
    (r) => r.userId === userId && r.movieId === movieId,
  );
  if (existingReview) {
    return res
      .status(409)
      .json({ error: "You have already reviewed this movie" });
  }

  const review = {
    id: randomUUID(),
    userId,
    movieId,
    rating,
    comment: comment || null,
    createdAt: new Date().toISOString(),
  };

  reviews.push(review);
  res.status(201).json(review);
});

// PATCH /reviews/:id
// * Update an existing review
router.patch("/:id", (req, res) => {
  const { userId, rating, comment } = req.body;
  const review = reviews.find((r) => r.id === req.params.id);

  if (!review) return res.status(404).json({ error: "Review not found" });

  // Ownership check
  if (review.userId !== userId) {
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

  res.json(review);
});

// DELETE /reviews/:id
// * Remove a review
router.delete("/:id", (req, res) => {
  const { userId } = req.body;
  const index = reviews.findIndex((r = r.id === req.params.id));

  if (index === -1) return res.status(404).json({ error: "Review not found" });

  if (reviews[index].userId !== userId) {
    // And the user is not an admin
    return res
      .status(403)
      .json({ error: "You can only delete your own reviews" });
  }

  reviews.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

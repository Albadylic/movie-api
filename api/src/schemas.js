const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// Example
const createMovieSchema = z.object({
  title: z.string().min(1),
  director: z.string().min(1),
  year: z
    .number()
    .int()
    .min(1888)
    .max(new Date().getFullYear() + 1),
  genre: z.string().min(1),
  synopsis: z.string().optional(),
});

// Challenge
const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),
  director: z.string().min(1).optional(),
  year: z
    .number()
    .int()
    .min(1888)
    .max(new Date().getFullYear() + 1)
    .optional(),
  genre: z.string().min(1).optional(),
  synopsis: z.string().optional(),
});

// Example
const createReviewSchema = z.object({
  userId: z.string().min(1),
  movieId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// Challenge
const updateReviewSchema = z.object({
  userId: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

module.exports = {
  createUserSchema,
  createMovieSchema,
  updateMovieSchema,
  createReviewSchema,
  updateReviewSchema,
};

# API Testing Plan

This guide walks through a full end-to-end test of the Movie API. Run these commands in order — each step builds on the previous one. Replace placeholder values like `<alice-token>` with the actual values returned by earlier commands.

---

## Prerequisites

- Server is running: `npm run dev`
- `jq` is installed (for pretty-printing JSON responses)
- `sqlite3` CLI is available (for the admin promotion step)

---

## 1. Register two users

Register Alice and Bob. Both requests include a password now that auth is implemented.

```bash
curl -s -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Alice", "email": "alice@example.com", "password": "password123"}' | jq .

curl -s -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Bob", "email": "bob@example.com", "password": "password123"}' | jq .
```

**Expected:** 201 response with user object (no password field). Each user gets a unique UUID.

---

## 2. Promote Alice to admin

Newly registered users default to the `USER` role. We manually promote Alice to `ADMIN` directly in the database — in a real app this would be done through an admin interface.

```bash
sqlite3 dev.db "UPDATE users SET role='ADMIN' WHERE email='alice@example.com';"
```

**Expected:** No output. Verify with:

```bash
sqlite3 dev.db "SELECT id, name, role FROM users;"
```

---

## 3. Log in as Alice and Bob

Exchange credentials for JWT tokens. These tokens will be used to authenticate all subsequent requests.

```bash
# Alice
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "alice@example.com", "password": "password123"}' | jq .

# Bob
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "bob@example.com", "password": "password123"}' | jq .
```

**Expected:** 200 response with `{ "token": "eyJ..." }`. Save both tokens — you'll need them throughout the rest of this guide.

---

## 4. Try to add a movie as Bob — should return 403

Only admins can add movies. This verifies the `requireAdmin` middleware is working correctly.

```bash
curl -s -X POST http://localhost:3000/movies \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <bob-token>' \
  -d '{"title": "Inception", "director": "Christopher Nolan", "year": 2010, "genre": "Sci-Fi"}' | jq .
```

**Expected:** `403 { "error": "Admin access required" }`

---

## 5. Add a movie as Alice

Alice is an admin, so this should succeed.

```bash
curl -s -X POST http://localhost:3000/movies \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <alice-token>' \
  -d '{"title": "Inception", "director": "Christopher Nolan", "year": 2010, "genre": "Sci-Fi"}' | jq .
```

**Expected:** `201` with the new movie object including a UUID. Save the `id` as `<movie-id>`.

---

## 6. Try to add a movie without a token — should return 401

Verifies that the `authenticate` middleware rejects unauthenticated requests.

```bash
curl -s -X POST http://localhost:3000/movies \
  -H 'Content-Type: application/json' \
  -d '{"title": "Inception", "director": "Christopher Nolan", "year": 2010, "genre": "Sci-Fi"}' | jq .
```

**Expected:** `401 { "error": "No token provided" }`

---

## 7. Bob leaves a review

Any authenticated user can submit a review.

```bash
curl -s -X POST http://localhost:3000/reviews \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <bob-token>' \
  -d '{"movieId": "<movie-id>", "rating": 5, "comment": "Mind-blowing"}' | jq .
```

**Expected:** `201` with the new review object. Save the `id` as `<review-id>`.

---

## 8. Bob tries to leave a second review — should return 409

The database has a `UNIQUE(movie_id, user_id)` constraint. A user can only review a movie once.

```bash
curl -s -X POST http://localhost:3000/reviews \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <bob-token>' \
  -d '{"movieId": "<movie-id>", "rating": 3}' | jq .
```

**Expected:** `409 { "error": "You have already reviewed this movie" }`

---

## 9. Alice tries to update Bob's review — should return 403

Users can only edit their own reviews. Alice owns no reviews, so this should be rejected.

```bash
curl -s -X PATCH http://localhost:3000/reviews/<review-id> \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <alice-token>' \
  -d '{"rating": 1}' | jq .
```

**Expected:** `403 { "error": "You can only update your own reviews" }`

---

## 10. Bob updates his own review — should return 200

```bash
curl -s -X PATCH http://localhost:3000/reviews/<review-id> \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <bob-token>' \
  -d '{"rating": 4, "comment": "Even better the second time"}' | jq .
```

**Expected:** `200` with the updated review object reflecting the new rating and comment.

---

## 11. Test pagination and filtering on movies

Add a second movie, then test the list endpoint with query params.

```bash
# Add a second movie
curl -s -X POST http://localhost:3000/movies \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <alice-token>' \
  -d '{"title": "The Dark Knight", "director": "Christopher Nolan", "year": 2008, "genre": "Action"}' | jq .

# Filter by director
curl -s "http://localhost:3000/movies?director=Christopher%20Nolan" | jq .

# Sort by year ascending
curl -s "http://localhost:3000/movies?sort=year&order=asc" | jq .

# Paginate — page 1, 1 result per page
curl -s "http://localhost:3000/movies?page=1&limit=1" | jq .
```

**Expected:** Filtered/sorted results with `data`, `total`, `page`, and `limit` fields in the response.

---

## 12. Alice deletes Bob's review — should succeed

Admins can delete any review regardless of ownership.

```bash
curl -s -X DELETE http://localhost:3000/reviews/<review-id> \
  -H 'Authorization: Bearer <alice-token>' | jq .
```

**Expected:** `204` with no response body.

---

## 13. Verify review is gone

```bash
curl -s "http://localhost:3000/reviews?movieId=<movie-id>" | jq .
```

**Expected:** `{ "data": [], "total": 0, "page": 1, "limit": 20 }`

---

## 14. Test validation errors

Verify Zod validation is rejecting bad input.

```bash
# Missing required fields
curl -s -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Charlie"}' | jq .

# Invalid email
curl -s -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Charlie", "email": "not-an-email", "password": "password123"}' | jq .

# Rating out of range
curl -s -X POST http://localhost:3000/reviews \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <bob-token>' \
  -d '{"movieId": "<movie-id>", "rating": 10}' | jq .
```

**Expected:** `400` with a `{ "errors": { ... } }` object describing which fields failed.

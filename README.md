# Movie Review API

A REST API for browsing movies and leaving reviews. Built with Node.js, Express, and SQLite.

## Stack

- **Express 5** — web framework
- **better-sqlite3** — SQLite database
- **Zod** — request validation
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT authentication
- **Jest + Supertest** — automated tests

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
JWT_SECRET=your-secret-here
```

Start the development server:

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default.

## Endpoints

### Auth

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/login` | Log in and receive a JWT token | — |

### Users

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/users` | Register a new user | — |
| GET | `/users/:id` | Get a user by ID | — |

### Movies

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/movies` | List all movies | — |
| GET | `/movies/:id` | Get a single movie | — |
| POST | `/movies` | Add a movie | Admin |
| PATCH | `/movies/:id` | Update a movie | Admin |
| DELETE | `/movies/:id` | Delete a movie | Admin |

### Reviews

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/reviews` | Get reviews by `?movieId=` or `?userId=` | — |
| POST | `/reviews` | Leave a review | Required |
| PATCH | `/reviews/:id` | Update your own review | Required |
| DELETE | `/reviews/:id` | Delete a review | Required |

## Authentication

Register and log in to receive a JWT token:

```bash
# Register
curl -s -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Alice", "email": "alice@example.com", "password": "password123"}'

# Log in
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "alice@example.com", "password": "password123"}'
# => { "token": "eyJ..." }
```

Pass the token in the `Authorization` header for protected routes:

```
Authorization: Bearer eyJ...
```

Tokens expire after 7 days.

## Roles

Users have one of two roles:

- **USER** (default) — can browse movies, write reviews, and manage their own reviews
- **ADMIN** — can also add, update, and delete movies, and delete any review

To promote a user to admin during development:

```bash
sqlite3 dev.db "UPDATE users SET role='ADMIN' WHERE email='alice@example.com';"
```

## Query parameters

`GET /movies` and `GET /reviews` support filtering, sorting, and pagination:

| Param | Description | Example |
|-------|-------------|---------|
| `genre` | Filter movies by genre | `?genre=Drama` |
| `director` | Filter movies by director | `?director=Nolan` |
| `year` | Filter movies by year | `?year=2010` |
| `rating` | Filter reviews by rating | `?rating=5` |
| `sort` | Sort field | `?sort=year` |
| `order` | Sort direction: `asc` or `desc` | `?order=asc` |
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Results per page (default: 20) | `?limit=10` |

Responses are wrapped in a pagination envelope:

```json
{
  "data": [...],
  "total": 42,
  "page": 2,
  "limit": 10
}
```

## Common errors

| Status | Cause |
|--------|-------|
| 400 | Missing or invalid field — check the request body matches the schema |
| 401 | No token provided or token is invalid/expired |
| 403 | Insufficient role, or trying to modify another user's resource |
| 404 | Resource not found — verify the ID exists |
| 409 | Conflict — e.g. email already registered, or duplicate review |

## Running tests

```bash
npm test                 # run all tests
npm run test:watch       # watch mode
npm run test:coverage    # generate coverage report
```

Tests use an in-memory SQLite database and do not affect `dev.db`.

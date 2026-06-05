require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const reviewsRouter = require("./routes/reviews");
const authRouter = require("./routes/auth");

app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/auth", authRouter);

// Error handler
//  * this mounts after every other route
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port: ${PORT}`);
});

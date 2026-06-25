const { randomUUID } = require("crypto");
const db = require("./db");

function seed() {
  const now = () => new Date().toISOString();

  const users = [
    {
      id: randomUUID(),
      name: "Alice Admin",
      email: "alice@example.com",
      role: "ADMIN",
    },
    {
      id: randomUUID(),
      name: "Bob Smith",
      email: "bob@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "Carol Jones",
      email: "carol@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "David Lee",
      email: "david@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "Eva Martinez",
      email: "eva@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "Frank Chen",
      email: "frank@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "Grace Kim",
      email: "grace@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "Henry Okafor",
      email: "henry@example.com",
      role: "USER",
    },
    {
      id: randomUUID(),
      name: "Isla Novak",
      email: "isla@example.com",
      role: "USER",
    },
  ];

  const movies = [
    {
      id: randomUUID(),
      title: "Inception",
      director: "Christopher Nolan",
      year: 2010,
      genre: "Sci-Fi",
      synopsis:
        "A thief who steals corporate secrets through dream-sharing technology is tasked with planting an idea.",
    },
    {
      id: randomUUID(),
      title: "The Godfather",
      director: "Francis Ford Coppola",
      year: 1972,
      genre: "Crime",
      synopsis:
        "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    },
    {
      id: randomUUID(),
      title: "Parasite",
      director: "Bong Joon-ho",
      year: 2019,
      genre: "Thriller",
      synopsis:
        "A poor family schemes to become employed by a wealthy household, with unexpected consequences.",
    },
    {
      id: randomUUID(),
      title: "Spirited Away",
      director: "Hayao Miyazaki",
      year: 2001,
      genre: "Animation",
      synopsis:
        "A young girl becomes trapped in a spirit world and must work to free herself and her parents.",
    },
    {
      id: randomUUID(),
      title: "Mad Max: Fury Road",
      director: "George Miller",
      year: 2015,
      genre: "Action",
      synopsis:
        "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland.",
    },
    {
      id: randomUUID(),
      title: "Eternal Sunshine of the Spotless Mind",
      director: "Michel Gondry",
      year: 2004,
      genre: "Romance",
      synopsis:
        "A couple undergo a medical procedure to erase each other from their memories after a painful breakup.",
    },
    {
      id: randomUUID(),
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      year: 1994,
      genre: "Drama",
      synopsis:
        "Two imprisoned men bond over years, finding solace and eventual redemption through acts of decency.",
    },
    {
      id: randomUUID(),
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      year: 1994,
      genre: "Crime",
      synopsis:
        "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    },
    {
      id: randomUUID(),
      title: "2001: A Space Odyssey",
      director: "Stanley Kubrick",
      year: 1968,
      genre: "Sci-Fi",
      synopsis:
        "Humanity finds a mysterious monolith affecting human evolution, leading to a manned mission to Jupiter.",
    },
    {
      id: randomUUID(),
      title: "Amélie",
      director: "Jean-Pierre Jeunet",
      year: 2001,
      genre: "Romance",
      synopsis:
        "A shy Parisian woman decides to change the lives of those around her for the better while neglecting her own happiness.",
    },
    {
      id: randomUUID(),
      title: "Get Out",
      director: "Jordan Peele",
      year: 2017,
      genre: "Horror",
      synopsis:
        "A young Black man uncovers a disturbing secret when he visits his white girlfriend's family estate.",
    },
    {
      id: randomUUID(),
      title: "The Hurt Locker",
      director: "Kathryn Bigelow",
      year: 2008,
      genre: "War",
      synopsis:
        "During the Iraq War, a reckless sergeant takes command of an Army bomb disposal unit and risks the lives of his team.",
    },
    {
      id: randomUUID(),
      title: "American Psycho",
      director: "Mary Harron",
      year: 2000,
      genre: "Thriller",
      synopsis:
        "A wealthy New York investment banker hides his alternate psychopathic ego from his colleagues and friends.",
    },
    {
      id: randomUUID(),
      title: "Mean Girls",
      director: "Mark Waters",
      year: 2004,
      genre: "Comedy",
      synopsis:
        "A teenager raised in Africa moves to the US and navigates the treacherous social hierarchy of a suburban high school.",
    },
    {
      id: randomUUID(),
      title: "Clueless",
      director: "Amy Heckerling",
      year: 1995,
      genre: "Comedy",
      synopsis:
        "A popular and wealthy Beverly Hills teenager navigates high school life while playing matchmaker for those around her.",
    },
  ];

  const reviewData = [
    {
      user: users[1],
      movie: movies[0],
      rating: 5,
      comment: "Mind-blowing concept and visuals.",
    },
    {
      user: users[2],
      movie: movies[0],
      rating: 4,
      comment: "Great film, slightly confusing ending.",
    },
    {
      user: users[3],
      movie: movies[0],
      rating: 5,
      comment: "A modern masterpiece.",
    },
    {
      user: users[5],
      movie: movies[0],
      rating: 5,
      comment: "Nolan's best work by far.",
    },
    {
      user: users[6],
      movie: movies[0],
      rating: 4,
      comment: "Requires your full attention but rewards it.",
    },
    {
      user: users[7],
      movie: movies[0],
      rating: 3,
      comment: "Technically impressive but emotionally cold.",
    },

    {
      user: users[1],
      movie: movies[1],
      rating: 5,
      comment: "The best film ever made.",
    },
    {
      user: users[4],
      movie: movies[1],
      rating: 4,
      comment: "Slow burn but absolutely worth it.",
    },

    {
      user: users[2],
      movie: movies[2],
      rating: 5,
      comment: "Deserved every award it won.",
    },
    {
      user: users[3],
      movie: movies[2],
      rating: 5,
      comment: "Brilliantly crafted from start to finish.",
    },
    {
      user: users[4],
      movie: movies[2],
      rating: 4,
      comment: "Unexpected and deeply satisfying.",
    },

    {
      user: users[1],
      movie: movies[3],
      rating: 5,
      comment: "A magical experience unlike any other.",
    },
    {
      user: users[2],
      movie: movies[3],
      rating: 5,
      comment: "Miyazaki at his absolute best.",
    },

    {
      user: users[3],
      movie: movies[4],
      rating: 4,
      comment: "Pure adrenaline, non-stop action.",
    },
    {
      user: users[4],
      movie: movies[4],
      rating: 3,
      comment: "Fun but thin on story.",
    },

    {
      user: users[1],
      movie: movies[5],
      rating: 5,
      comment: "Heartbreaking and beautiful.",
    },
    {
      user: users[2],
      movie: movies[5],
      rating: 4,
      comment: "Jim Carrey's best performance.",
    },
    {
      user: users[4],
      movie: movies[5],
      rating: 5,
      comment: "A genuinely unique film.",
    },

    {
      user: users[0],
      movie: movies[6],
      rating: 5,
      comment: "One of the most uplifting films ever made.",
    },
    {
      user: users[3],
      movie: movies[6],
      rating: 5,
      comment: "Morgan Freeman's narration makes it perfect.",
    },
    {
      user: users[4],
      movie: movies[6],
      rating: 4,
      comment: "Slow to start but the payoff is enormous.",
    },
    {
      user: users[5],
      movie: movies[6],
      rating: 5,
      comment: "A film that restores your faith in humanity.",
    },
    {
      user: users[6],
      movie: movies[6],
      rating: 4,
      comment: "Tim Robbins gives a quietly brilliant performance.",
    },
    {
      user: users[7],
      movie: movies[6],
      rating: 5,
      comment: "Every rewatch reveals something new.",
    },

    {
      user: users[0],
      movie: movies[7],
      rating: 5,
      comment: "Tarantino at his sharpest.",
    },
    {
      user: users[2],
      movie: movies[7],
      rating: 4,
      comment: "Incredible dialogue, unconventional structure.",
    },
    {
      user: users[3],
      movie: movies[7],
      rating: 3,
      comment: "Stylish but I found it a bit gratuitous.",
    },

    {
      user: users[0],
      movie: movies[8],
      rating: 5,
      comment: "Still feels ahead of its time.",
    },
    {
      user: users[1],
      movie: movies[8],
      rating: 4,
      comment: "Challenging but visually stunning.",
    },
    {
      user: users[4],
      movie: movies[8],
      rating: 3,
      comment: "Brilliant filmmaking, not always easy watching.",
    },

    {
      user: users[0],
      movie: movies[9],
      rating: 5,
      comment: "Whimsical, warm, and completely original.",
    },
    {
      user: users[3],
      movie: movies[9],
      rating: 4,
      comment: "Audrey Tautou is enchanting in this.",
    },
    {
      user: users[4],
      movie: movies[9],
      rating: 5,
      comment: "The most charming film I have ever seen.",
    },

    {
      user: users[0],
      movie: movies[10],
      rating: 5,
      comment: "Brilliantly unsettling from start to finish.",
    },
    {
      user: users[1],
      movie: movies[10],
      rating: 5,
      comment: "Jordan Peele announced himself as a major talent.",
    },
    {
      user: users[2],
      movie: movies[10],
      rating: 4,
      comment: "Clever, tense, and thought-provoking.",
    },

    {
      user: users[0],
      movie: movies[11],
      rating: 5,
      comment: "Deserved every Oscar it won.",
    },
    {
      user: users[2],
      movie: movies[11],
      rating: 4,
      comment: "Intense and uncomfortably real.",
    },
    {
      user: users[3],
      movie: movies[11],
      rating: 4,
      comment: "Renner is outstanding.",
    },

    {
      user: users[0],
      movie: movies[12],
      rating: 4,
      comment: "Bale is terrifyingly good.",
    },
    {
      user: users[1],
      movie: movies[12],
      rating: 4,
      comment: "A sharp satire wrapped in a thriller.",
    },
    {
      user: users[4],
      movie: movies[12],
      rating: 3,
      comment: "Entertaining but deeply uncomfortable.",
    },

    {
      user: users[0],
      movie: movies[13],
      rating: 5,
      comment: "Endlessly quotable and surprisingly sharp.",
    },
    {
      user: users[2],
      movie: movies[13],
      rating: 4,
      comment: "Tina Fey's script is genuinely funny.",
    },
    {
      user: users[4],
      movie: movies[13],
      rating: 5,
      comment: "A perfect teen comedy.",
    },
    {
      user: users[5],
      movie: movies[13],
      rating: 4,
      comment: "Still holds up remarkably well.",
    },
    {
      user: users[6],
      movie: movies[13],
      rating: 5,
      comment: "Lindsay Lohan at the peak of her powers.",
    },
    {
      user: users[7],
      movie: movies[13],
      rating: 3,
      comment: "Fun but fairly predictable.",
    },

    {
      user: users[0],
      movie: movies[14],
      rating: 4,
      comment: "A clever Austen adaptation hiding in plain sight.",
    },
    {
      user: users[1],
      movie: movies[14],
      rating: 3,
      comment: "Charming even if it is not really my genre.",
    },
    {
      user: users[3],
      movie: movies[14],
      rating: 5,
      comment: "Alicia Silverstone is iconic in this role.",
    },

    {
      user: users[8],
      movie: movies[1],
      rating: 4,
      comment: "An offer I could not refuse.",
    },
    {
      user: users[8],
      movie: movies[5],
      rating: 5,
      comment: "Wrecked me completely. In the best way.",
    },
    {
      user: users[8],
      movie: movies[8],
      rating: 3,
      comment: "Visually stunning but I zoned out by the third act.",
    },
    {
      user: users[8],
      movie: movies[11],
      rating: 4,
      comment: "Tense and harrowing in equal measure.",
    },
    { user: users[8], movie: movies[13], rating: 5, comment: "So fetch." },
  ];

  db.serialize(() => {
    db.run("DELETE FROM reviews");
    db.run("DELETE FROM movies");
    db.run("DELETE FROM users");

    const insertUser = db.prepare(
      "INSERT INTO users (id, name, email, role, created_at) VALUES (?, ?, ?, ?, ?)",
    );
    for (const u of users) {
      insertUser.run(u.id, u.name, u.email, u.role, now());
    }
    insertUser.finalize();

    const insertMovie = db.prepare(
      "INSERT INTO movies (id, title, director, year, genre, synopsis, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    for (const m of movies) {
      insertMovie.run(
        m.id,
        m.title,
        m.director,
        m.year,
        m.genre,
        m.synopsis ?? null,
        now(),
      );
    }
    insertMovie.finalize();

    const insertReview = db.prepare(
      "INSERT INTO reviews (id, movie_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    );
    for (const r of reviewData) {
      insertReview.run(
        randomUUID(),
        r.movie.id,
        r.user.id,
        r.rating,
        r.comment ?? null,
        now(),
      );
    }
    insertReview.finalize((err) => {
      if (err) {
        console.error("Seed failed:", err);
        process.exit(1);
      }
      console.log(
        `Seeded ${users.length} users, ${movies.length} movies, ${reviewData.length} reviews.`,
      );
    });
  });
}

seed();

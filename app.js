const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Database configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "booksapi_library_gdgoc"
});

// Check database connection
connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Successfully connected to MySQL database");
});

// Root route - Menambahkan homepage
app.get("/", (req, res) => {
  res.send(`
    <h1>Library Books REST API</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li>POST /api/books - Create New Book</li>
      <li>GET /api/books - List All Books</li>
      <li>GET /api/books/:id - Get Book Detail</li>
      <li>PUT /api/books/:id - Update Book</li>
      <li>DELETE /api/books/:id - Delete Book</li>
    </ul>
  `);
});

// CREATE: Add new book
app.post("/api/books", (req, res) => {
  const { title, author, published_at, genre } = req.body;
  const query = "INSERT INTO books (title, author, published_at, genre) VALUES (?, ?, ?, ?)";

  connection.query(query, [title, author, published_at, genre], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to create book" });
    }

    // Fetch the created book to return in response
    const selectQuery = "SELECT * FROM books WHERE id = ?";
    connection.query(selectQuery, [result.insertId], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch created book" });
      }

      res.status(201).json({
        message: "Book created successfully",
        data: rows[0]
      });
    });
  });
});

// READ: Get all books
app.get("/api/books", (req, res) => {
  const query = "SELECT * FROM books";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch books" });
    }
    res.status(200).json({
      data: results
    });
  });
});

// READ: Get single book
app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const query = "SELECT * FROM books WHERE id = ?";

  connection.query(query, [bookId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch book" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      data: results[0]
    });
  });
});

// UPDATE: Update book
app.put("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const updates = req.body;

  // First check if book exists
  connection.query("SELECT * FROM books WHERE id = ?", [bookId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch book" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const currentBook = results[0];
    const updatedBook = {
      title: updates.title || currentBook.title,
      author: updates.author || currentBook.author,
      published_at: updates.published_at || currentBook.published_at,
      genre: updates.genre || currentBook.genre
    };

    // Update the book
    const query = "UPDATE books SET title = ?, author = ?, published_at = ?, genre = ? WHERE id = ?";
    connection.query(
      query,
      [updatedBook.title, updatedBook.author, updatedBook.published_at, updatedBook.genre, bookId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to update book" });
        }

        // Fetch and return the updated book
        connection.query("SELECT * FROM books WHERE id = ?", [bookId], (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Failed to fetch updated book" });
          }

          res.status(200).json({
            message: "Book updated successfully",
            data: results[0]
          });
        });
      }
    );
  });
});

// DELETE: Delete book
app.delete("/api/books/:id", (req, res) => {
  const bookId = req.params.id;

  // First check if book exists
  connection.query("SELECT * FROM books WHERE id = ?", [bookId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch book" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the book
    const query = "DELETE FROM books WHERE id = ?";
    connection.query(query, [bookId], (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete book" });
      }

      res.status(200).json({
        message: "Book deleted successfully"
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
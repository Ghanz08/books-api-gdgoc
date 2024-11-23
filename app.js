const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "booksapi_ghani08",
  password: "(K_z(z2&?Z&n",
  database: "booksapi_library_gdgoc",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,
  acquireTimeout: 10000,
});

const promisePool = pool.promise();

// Root route
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
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, published_at } = req.body;
    
    // Get current timestamp in the required format
    const now = new Date().toISOString();
    
    const query = `
      INSERT INTO books (title, author, published_at, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await promisePool.execute(query, [
      title, 
      author, 
      published_at,
      now,
      now
    ]);
    
    const [rows] = await promisePool.execute(
      "SELECT * FROM books WHERE id = ?", 
      [result.insertId]
    );

    res.status(201).json({
      message: "Book created successfully",
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create book" });
  }
});

// READ: Get all books
app.get("/api/books", async (req, res) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM books");
    res.status(200).json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// READ: Get single book
app.get("/api/books/:id", async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM books WHERE id = ?", 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

// UPDATE: Update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;
    
    // First check if book exists
    const [existingBook] = await promisePool.execute(
      "SELECT * FROM books WHERE id = ?", 
      [bookId]
    );
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    const currentBook = existingBook[0];
    const updatedBook = {
      title: updates.title || currentBook.title,
      author: updates.author || currentBook.author,
      published_at: updates.published_at || currentBook.published_at,
      updated_at: new Date().toISOString()
    };
    
    await promisePool.execute(
      "UPDATE books SET title = ?, author = ?, published_at = ?, updated_at = ? WHERE id = ?",
      [
        updatedBook.title, 
        updatedBook.author, 
        updatedBook.published_at,
        updatedBook.updated_at,
        bookId
      ]
    );
    
    const [rows] = await promisePool.execute(
      "SELECT * FROM books WHERE id = ?", 
      [bookId]
    );
    
    res.status(200).json({
      message: "Book updated successfully",
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update book" });
  }
});

// DELETE: Delete book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    
    // Check if book exists
    const [existingBook] = await promisePool.execute(
      "SELECT * FROM books WHERE id = ?", 
      [bookId]
    );
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    await promisePool.execute(
      "DELETE FROM books WHERE id = ?", 
      [bookId]
    );
    
    res.status(200).json({
      message: "Book deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Handle process termination
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Error closing pool:', err);
    }
    process.exit(0);
  });
});
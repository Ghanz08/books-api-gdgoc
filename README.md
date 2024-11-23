# Library Books REST API

A RESTful API for managing books in a library system. Built with Node.js, Express, and MySQL.

## 📚 Overview

The Library Books REST API provides endpoints to manage books in a library. You can perform basic CRUD (Create, Read, Update, Delete) operations on book records.

## 🚀 Features

- Create new books
- List all books
- Get book details by ID
- Update existing books
- Delete books
- No authentication required
- No rate limiting

## 🛠️ Technologies Used

- Node.js
- Express
- MySQL
- CORS
- Body Parser

## 📋 Prerequisites

- Node.js installed
- MySQL database server
- Git (for cloning the repository)

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Ghanz08/books-api-gdgoc.git
```

2. Install dependencies:
```bash
npm install
```

3. Configure your database in `app.js`

4. Start the server:
```bash
npm start
```

## 💾 Database Schema

```sql
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_at DATE NOT NULL,
    genre VARCHAR(100)
);
```

## 🔌 API Endpoints

### Base URL
```
http://books-api-ghani.my.id
```

### Available Endpoints

#### Create New Book
- **URL**: `/api/books`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "string",
    "author": "string",
    "published_at": "YYYY-MM-DD",
    "genre": "string"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `500 Internal Server Error`

#### List All Books
- **URL**: `/api/books`
- **Method**: `GET`
- **Success Response**: `200 OK`
- **Error Response**: `500 Internal Server Error`

#### Get Book Detail
- **URL**: `/api/books/:id`
- **Method**: `GET`
- **Success Response**: `200 OK`
- **Error Response**: 
  - `404 Not Found`
  - `500 Internal Server Error`

#### Update Book
- **URL**: `/api/books/:id`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "title": "string",
    "author": "string",
    "published_at": "YYYY-MM-DD",
    "genre": "string"
  }
  ```
- **Success Response**: `200 OK`
- **Error Response**:
  - `404 Not Found`
  - `500 Internal Server Error`

#### Delete Book
- **URL**: `/api/books/:id`
- **Method**: `DELETE`
- **Success Response**: `200 OK`
- **Error Response**:
  - `404 Not Found`
  - `500 Internal Server Error`

## 🧪 Testing

The API includes Postman tests for each endpoint that verify:
- Response status codes
- Response schema validation
- Data integrity
- Error handling

## 📝 Response Examples

### Successful Book Creation
```json
{
  "message": "Book created successfully",
  "data": {
    "title": "Introduction to Programming",
    "author": "John Doe",
    "published_at": "2023-05-15",
    "updated_at": "2023-05-15T10:00:00.000Z",
    "created_at": "2023-05-15T10:00:00.000Z",
    "id": 1
  }
}
```

### Book Not Found Error
```json
{
  "message": "Book not found"
}
```

Project Repository: [https://github.com/Ghanz08/books-api-gdgoc](https://github.com/Ghanz08/books-api-gdgoc)

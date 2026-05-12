const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const bookClient = axios.create({
  adapter: async (config) => ({
    data: books,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    request: {}
  })
});

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await bookClient.get("/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await bookClient.get("/books/isbn");

    if (!response.data[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(response.data[isbn]);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve book" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  res.send(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const title = req.params.isbn;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].isbn === isbn) {
      matchingBooks[review] = books[review];
    }
  });

  res.send(matchingBooks);
});

module.exports.general = public_users;

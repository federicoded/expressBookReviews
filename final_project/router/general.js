const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).send("Username already exists");
    }

    users.push({ username, password });
    return res.send("User registered successfully");
});

public_users.get('/', (req, res) => {
    return res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).send({ message: "Book not found" });
    }
});


public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const result = [];

    Object.keys(books).forEach(isbn => {
        if (books[isbn].author === author) {
            result.push({ isbn, ...books[isbn] });
        }
    });

    if (result.length > 0) {
        return res.send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).send({ message: "No books found for this author" });
    }
});


public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const result = [];

    Object.keys(books).forEach(isbn => {
        if (books[isbn].title === title) {
            result.push({ isbn, ...books[isbn] });
        }
    });

    if (result.length > 0) {
        return res.send(JSON.stringify(result, null, 4));
    } else {
        return res.status(404).send({ message: "No books found with this title" });
    }
});


public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).send({ message: "Book not found" });
    }
});

const axios = require('axios');

public_users.get('/async/books', async (req, res) => {
    try {
        let response = await axios.get("https://federicoguig-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        return res.status(200).json({
            message: "Books fetched using async/await",
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        let response = await axios.get("https://federicoguig-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        return res.status(200).json({
            message: "Book fetched using async/await",
            data: response.data
        });
    } catch (error) {
        return res.status(404).json({ message: "Error fetching book by ISBN" });
    }
});

public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        let response = await axios.get("https://federicoguig-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        return res.status(200).json({
            message: "Books fetched using async/await",
            data: response.data
        });
    } catch (error) {
        return res.status(404).json({ message: "Error fetching books by author" });
    }
});

public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        let response = await axios.get("https://federicoguig-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        return res.status(200).json({
            message: "Books fetched using async/await",
            data: response.data
        });
    } catch (error) {
        return res.status(404).json({ message: "Error fetching books by title" });
    }
});

module.exports.general = public_users;
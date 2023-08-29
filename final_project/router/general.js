const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {  
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body)
    if (username && password) {
        if (!isValid(username)) {
            return res.status(404).json({message: "User already exists!"});
        }
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
//    res.send(JSON.stringify(books, null, 4))
//});

public_users.get('/', function (req, res) {
    Promise.resolve(books)
    .then(function(books) {
        res.send(JSON.stringify(books, null, 4));
    })
    .catch(function(error) {
        res.status(500).send(error);
    });
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//  let chosenBook = books[req.params.isbn]
//  res.send(JSON.stringify(chosenBook, null, 4))
// });

 public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    Promise.resolve(books[isbn])
    .then(function(chosenBook) {
        res.send(JSON.stringify(chosenBook, null, 4));
    })
    .catch(function(error) {
        res.status(500).send(error);
    });
});
  
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let matchingBooks = [];
    for (const [isbn, book] of Object.entries(books)) {
        if (book.author === author) {
            matchingBooks.push(book);
        }
    }

    Promise.resolve(matchingBooks)
    .then(function(matchingBooks) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch(function(error) {
        res.status(500).send(error);
    });
});

public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let matchingBooks = [];
    for (const [isbn, book] of Object.entries(books)) {
        if (book.title === title) {
            matchingBooks.push(book);
        }
    }

    Promise.resolve(matchingBooks)
    .then(function(matchingBooks) {
        res.send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch(function(error) {
        res.status(500).send(error);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let chosenBook = books[req.params.isbn]
    res.send(JSON.stringify(chosenBook.reviews, null, 4))
});

module.exports.general = public_users;

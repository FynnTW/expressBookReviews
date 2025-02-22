const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    users.forEach(user => {
        if (user.username === username) {
            return false;
        }
    })
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    users.forEach(user => {
        if (user.username === username && user.password === password) {
            return true;
        }
    })
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
                data: password
            }, 'access', {expiresIn: 60 * 60})
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
    }
    
    return res.status(401).json({message: "wrong username"})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username
    const review = req.body.text
    books[req.params.isbn].reviews[username] = review
    return res.status(200).json({message: "Review added to book with following details" + JSON.stringify(books[req.params.isbn], null, 4)})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username
    const review = req.body.text
    books[req.params.isbn].reviews[username] = null   
    return res.status(200).json({message: "Review deleted from book" + books[req.params.isbn].title})


})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

/* routes for users management */
const express = require('express');
const md5 = require('md5');
const db = require('./db');

const router = express.Router();

const SERVER_ERR = "our server is experiencing some difficulties :(";

// sign up route
router.post('/signup', (req, res) => {
    // checks if user is already in db.
    // if not: inserts user to db.
    let data = req.body;
    let userQuery = { user: data.user.toLowerCase() };
    data.pass = md5(data.pass);

    // serverside verification
    if (data.user.length < 3) {
        res.status(409).send("your username has to be at least 3 characters long");
        return;
    }
    if (data.pass.length < 6) {
        res.status(409).send("your password has to be at least 6 characters long");
        return;
    }

    db.find(userQuery).then(
        user => {
            if (user) {
                res.status(409).send("there's already a user with this username!");
                return;
            }

            db.insert(data).then(
                _ => res.send("Welcome to A++, " + data.user.toLowerCase() + "!"),
                _ => res.status(500).send(SERVER_ERR)
            );
        },
        _ => res.status(500).send(SERVER_ERR)
    );
});

// route for login
router.post('/login', (req, res) => {
    // checks if username and password match a user in db
    // if so: returns their document (without password)
    let data = req.body;
    let userQuery = { user: data.user.toLowerCase(), pass: md5(data.pass) };

    db.find(userQuery, { pass: 0 }).then(
        doc => {
            if (!doc) {
                res.status(409).send("OOPS! Either the username or the password are incorrect!");
                return;
            }

            res.send(doc);
        },
        _ => res.status(500).send(SERVER_ERR)
    );
});

// route for update users courses
router.put('/course', (req, res) => {
    let data = req.body;
    let query = { user: data.user.toLowerCase() };
    let values = {
        multiply: data.multiply,
        points: data.points,
        courses: data.courses
    };

    db.update(query, values).then(
        _ => res.end(),
        _ => res.status(500).send(SERVER_ERR)
    );
});

module.exports = router;
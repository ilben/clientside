/* routes for users management */
const express = require('express');
const md5 = require('md5');
const db = require('./db');

const router = express.Router();


router.post('/signup', (req, res) => {
    let data = req.body;
    let userQuery = { user: data.user.toLowerCase() };
    data.pass = md5(data.pass);

    db.find(userQuery).then(
        user => {
            if (user) {
                res.status(400).send("there's already a user with this username!")
                return;
            }

            db.insert(data);
            res.send("successfully registered!");
        },
        reason => res.status(500).send("our server is having some difficulties :(")
    );
});

router.post('/login', (req, res) => {
    let data = req.body;
    let userQuery = { user: data.user.toLowerCase(), pass: md5(data.pass) };

    db.find(userQuery, {pass: 0}).then(
        doc => {
            if (!doc) {
                res.status(400).send("OOPS! Either the username or the password are incorrect!")
                return;
            }
            res.send(doc);
        },
        reason => res.status(500).send("our server is having some difficulties :(")
    );
});

router.put('/course', (req, res) => {
    let data = req.body;
    let query = { user: data.user.toLowerCase() };
    let values = {
        multiply: data.multiply,
        points: data.points,
        courses: data.courses
    };

    db.update(query, values).then(
        value => res.end(),
        reason => res.status(500).send("our server is having some difficulties :(")
    );
});

module.exports = router;
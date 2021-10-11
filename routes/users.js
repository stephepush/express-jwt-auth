const mysql = require('mysql2');
const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const utils = require('../lib/utils');

// TODO
router.get('/protected', (req, res, next) => {

});

// TODO
router.post('/login', function(req, res, next) {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    })

    newUser.save()
        .then((user) => {
            res.json({ success: true, user: user });
        })
        .catch(err => next(err))
});

// TODO
router.post('/register', function(req, res, next) {

});

module.exports = router;
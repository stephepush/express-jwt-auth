const router = require('express').Router();
const User = require('../models/user').User;
const passport = require('passport');
const utils = require('../lib/utils');
const connection = require('../config/database').connection

// TODO
router.get('/protected', (req, res, next) => {

});

// TODO
router.post('/login', function(req, res, next) {

});

// TODO
router.post('/register', function(req, res, next) {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const username = req.body.username;
    //console.log(salt)
    const newUser = new User(
            username,
            hash,
            salt
        )
        //console.log("new user entered: \n" + newUser.username + "\n" + newUser.hash + "\n" + newUser.salt)
    newUser.save()
        //console.log("new user entered: \n" + newUser.username + "\n" + newUser.hash + "\n" + newUser.salt)
        .then((user) => {
            console.log("new user entered: \n" + newUser.username + "\n" + newUser.hash + "\n" + newUser.salt)
            const jwt = utils.issueJWT(user);

            res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
        })
        .catch(err => next(err))
});

module.exports = router;
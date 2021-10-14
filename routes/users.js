const router = require('express').Router();
const User = require('../models/user').User;
const passport = require('passport');
const utils = require('../lib/utils');
const connection = require('../config/database').connection

// TODO
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: 'You are authorized!' })
});

// TODO
router.post('/login', function(req, res, next) {
    User.findOne(req.body.username) //username entered in the form
        .then((user) => {
            console.log(user[0][0])
            console.log(req.body.username)
            if (user[0][0] === undefined) {
                /*
                    Line 18^: if mysql method returns undefined, show next line
                    Don't know if best way to do this
                */
                res.status(401).json({ success: false, msg: "could not find user" });
            }
            console.log("validPassword: " + utils.validPassword(req.body.password, user[0][0].hash, user[0][0].salt))
            const isValid = utils.validPassword(req.body.password, user[0][0].hash, user[0][0].salt)

            if (isValid) {
                const tokenObject = utils.issueJWT(user);

                res.status(200).json({ success: true, user: user[0][0], token: tokenObject.token, expiresIn: tokenObject.expires })
            } else {
                res.status(401).json({ success: false, msg: "you entered the wrong password" });
            }
        })
        .catch((err) => {
            next(err);
        })
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
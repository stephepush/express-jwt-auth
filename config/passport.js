const fs = require('fs');
const path = require('path');
const connection = require('./database');
const { User } = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { issueJWT } = require('../lib/utils');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new JwtStrategy(options, (jwt_payload, done) => {
    console.log('----NEW LINE----')

    console.log(jwt_payload)

    console.log('___what you need is above this line____')
    User.findById(jwt_payload.sub) //findOne, find user by username
        //User.findOne(payload.sub)

    .then((user) => {
            console.log(jwt_payload)
            console.log("above is jwt_payload value")

            console.log("above is user[0][0] value")
            user = user[0][0];
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, null));
})

module.exports = (passport) => {
    passport.use(strategy)

}
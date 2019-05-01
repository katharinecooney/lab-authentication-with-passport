const passport = require("passport");
const User = require('../models/user');

passport.serializeUser((userObj, done) => {
  done(null, userObj._id);
});

passport.deserializeUser((idFromCookie, done) => {
  User.findById(idFromCookie)
    .then((userObj) => {    
      done(null, userObj);  
    })
    .catch((err) => done(err));
});

module.exports = passport;
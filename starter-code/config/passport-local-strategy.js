const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

const localStrategy = new LocalStrategy (
  ( username, password, done) => {

    User.findOne({ username }, (err, userObj) => {
      if (err) return done(err);
      if (!userObj) return done (null, false, { message: "Incorrect username" });

      const passwordCorrect = bcrypt.compareSync(password, userObj.password);
      if (!passwordCorrect) return done(null, false, { message: "Incorrect password" });

      return done(null, userObj);
    });
  })

  module.exports = localStrategy;
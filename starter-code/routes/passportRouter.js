const express = require("express");
const passportRouter = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt')
const bcryptSalt = 10;

const passport = require('passport');
const ensureLogin = require("connect-ensure-login");


const checkIfAuthenticated = (req, res, next) => {
  if(!req.user) res.redirect('/login'); // if not logged in / authenticated
  else next();  // if logged in / authenticated
}

/***************** DISPLAY SIGNUP FORM **********************/

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

/***************** POST NEW USER TO DB **********************/

passportRouter.post('/signup', (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render('passport/signup', {message: "Indicate username and password"});
    return;
  }

  User.findOne({username})
    .then ((user) => {
      if (user !== null) {
        res.render('passport/signup', {message: "The username already exists!"});
        return;
      }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hashedPassword });

    newUser.save((err) => {
      if (err) res.render("auth/signup", { message: "Something went wrong" });
      else res.redirect("/");
    })
  })

  .catch(error => next(error))
})

/***************** DISPLAY LOGIN FORM **********************/

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

/***************** LOG THE USER IN **********************/

passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  passReqToCallback: true
}));

/************* ALLOW ACCESS TO PRIVATE PAGE **************/

passportRouter.get("/private-page", checkIfAuthenticated, (req, res) => {
  res.render("passport/private", { user: req.user });
});

/************* EXPORT THE ROUTER FOR USE IN INDEX.JS **************/

module.exports = passportRouter;
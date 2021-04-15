const express = require("express"),
  Router = express.Router(),
  path = require('path'),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  findOrCreate = require('mongoose-findorcreate');

const User = require(path.resolve("src/Schema/") + "/User.js");
passport.use(User.createStrategy());

const log_update = require(path.resolve("src/") + "/log_update.js"),
  profile_update = require(path.resolve("src/") + "/profile_update.js");


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));


Router.post("/login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        var redirectTo = req.session.redirectTo || '/account';
        delete req.session.redirectTo;
        res.redirect(redirectTo);
      });
    }
  });
});

Router.post("/register", function(req, res) {
  console.log(req.body.username);
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/account/register");
    } else {

      User.findOne({
        username: req.body.username
      }, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          if (req.body.fname) {
            user.firstName = req.body.fname;
          }
          if (req.body.lname) {
            user.lastName = req.body.lname;
          }
          if (req.body.birthday) {
            user.birthday = req.body.birthday;
          }
          if (req.body.mobile) {
            user.mobile = req.body.mobile;
          }
          if (req.body.gender) {
            user.gender = req.body.gender;
          }
          if (req.body.email) {
            user.emailId = req.body.username;
          }
          if (req.body.altemail) {
            user.emailId = req.body.altemail;
          }
          if (req.body.altmobile) {
            user.emailId = req.body.altmobile;
          }
          user.save();
        }
      });

      passport.authenticate("local")(req, res, function() {
        res.redirect("/account");
      });
    }
  });

});

module.exports = Router;

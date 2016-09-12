// config/passport.js
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  usersModel  = require('../modules/usersModel.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      usersModel.findById(id, function(err, user) {
          done(err, user);
      });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    usersModel.findByEmail(email)
      .then (function(user) {
        // if there are any errors, return the error
        // check to see if theres already a user with that email
        if (user.length > 0) {
          console.log("there is a user");
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          usersModel.createUser(email,password)
          .then (function(user) {
            return done(null, user);
          }, function(rejection) {
            throw rejection;
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    usersModel.authenticateUser(email, password)
      .then (function(user) {
        // if there are any errors, return the error
        // check to see if theres already a user with that email
        if (user) {
          return done(null, user)
        }
        }, function(rejection) {
          throw rejection;
      });
    });
  }));
};

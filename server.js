// modules =================================================
var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    crypto 				 = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

// config files

var port = process.env.PORT || 8080; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public/')); // set the static files location /public/img will be /img for user
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'somesecret' }));
app.use(passport.initialize());
app.use(passport.session());


// Passport Settings ==================================================
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next)
{ if (!req.isAuthenticated())
  res.send(401);
  else next();
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// routes ==================================================
app.get('/', function(req, res) {
  res.sendfile("public/js/partials/index.html");
});

user = {list:[1,2,3,4]};


// route to test if user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user :'0' );
});

// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res) {
  req.logOut();
  res.send(200);
})

// start app ===============================================
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app

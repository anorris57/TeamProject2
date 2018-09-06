// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// ******************************************************************************
// *** Dependencies
// =============================================================
// Requiring Express and Body-Parser
var express = require("express");
var bodyParser = require("body-parser");

// Requiring Login Session Management 
var session = require("express-session");

// Requiring passport database sequelize configuration 
var passport = require("./config/passport");
var app = express();

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;

// Requiring our models for synching
var db = require("./models");

// Requiring http and socket
var server = require('http').Server(app);
//var io = require('socket.io')(server);

// Creating express app and configuring middleware needed for authentication
// Sets up the Express app to handle data parsing
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
// Routes- we have 
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

//newest update
// Starts the server to begin listening
// =============================================================
db.sequelize.sync({
   //force: true
}).then(function () {
  server.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});


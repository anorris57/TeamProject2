// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************
// Dependencies
// =============================================================
var path = require("path");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
// Routes
// =============================================================
module.exports = function(app)
{
  // Following are the Login routes for Pages
  // Each of the below routes just handles the HTML page that the user gets sent to.
  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  //login route
  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
  });

  //sign up route
  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/signup.html"));
  })

  app.get("/loginforsignup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/members.html"));
  });
  app.get("/allvisitors", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/memberslogin", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  //*******************************************************************************************************//
  // Following are the routes for Blogging (CRUD)
  //update route for loading existing blogs
  app.get("/blog", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/html/members.html"))
  })

};

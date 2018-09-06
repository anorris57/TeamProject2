// Requiring our sequelize models and passport
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware. We are using local strategy for authentication.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  // app.post("/api/login", passport.authenticate("local", {successRedirect: "/members" , failureRedirect: "/login"}));
  // Uses local strategy with email as user id and password
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json("/members");
  });
  //
  
  //Route to login page if user failed to login. I created this to allow flash messages and not interfere with regular login route
  app.get("/loginfailed", function(req, res){
    if (!req.user){
      alert("success", "Username or password is incorrect.");
      res.redirect("/login");
    }
  });
  //
  // Route for signing up a user/Creating a new User credential. 
  // The user's password is hashed and stored securely.
  // If the user is created successfully, proceed to log the user in page for logging in.
  // If the use is not able to be signed up, then send an error back.
  app.post("/api/signup", function(req, res) {
    //console.log ("User Data = " + req.body.userName + "=" + req.body.email + "=" + req.body.password);
    db.User.create({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      logged: true
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      res.json(err);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res)
  {
    req.logout();
    res.redirect("/allvisitors");
  });

//update logged off on the database by setting state to false
app.get("/api/leave/", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.User.findAll({}).then(function(dbTodo) {
      res.json(dbTodo);
    });
    res.redirect("/logout");
  });

//once logout update the logged state
app.put("/logout", function (req, res)
{
  db.User.update(
  { logged: false},
  {
    where: {  email: req.body.email}
  }).then(function (getUpdate) {
    res.json(getUpdate);
  });
});
//end of logout area

//update login state
app.put("/api/login", function (req, res)
{
  db.User.update(
  { logged: true},
  {
    where: { email: req.body.email}
  }).then(function (getUpdate) {
    res.json(getUpdate);
  });
});

// Routes for Posts management
// GET route for getting all of the posts
app.get("/api/posts/", function(req, res) {
  db.Post.findAll({
    order:[["createdAt" , "DESC"]]
  }).then(function(dbPost) {
      res.json(dbPost);
    });
});

// Get route for returning posts of a specific category- use email instead of category
app.get("/api/posts/category/:category", function(req, res) {
  db.Post.findAll({
    where: {
      category: req.params.category
    }
  })
    .then(function(dbPost) {
      res.json(dbPost);
    });
});

// Get route for returning posts of a specific category- use email instead of category
app.get("/api/posts/email/:email", function(req, res) {
  db.Post.findAll({
    where: {
      email: req.params.email
    },
    order:[["createdAt" , "DESC"]]
  })
    .then(function(dbPost) {
      res.json(dbPost);
    });
});

// Get route for retrieving a single post
app.get("/api/posts/:id", function(req, res) {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(function(dbPost) {
      res.json(dbPost);
    });
});

// POST route for saving a new post
app.post("/api/posts", function(req, res) {
  console.log(req.body);
  db.Post.create({
    email: req.body.email,
    title: req.body.title,
    body: req.body.body,
    category: req.body.category
  })
    .then(function(dbPost) {
      res.json(dbPost);
    });
});

// DELETE route for deleting posts
app.delete("/api/posts/:id", function(req, res) {
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function(dbPost) {
      res.json(dbPost);
    });
});

// PUT route for updating posts
app.put("/api/posts", function(req, res) {
  db.Post.update(req.body,
    {
      where: {
        id: req.body.id
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    });
});
};

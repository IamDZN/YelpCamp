var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res) {
    res.render("landing");
    //res.redirect("/campgrounds" );
});

//Register Route
router.get("/register", function(req, res){
    res.render("register");
});

//Handle signup logic route
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");            
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Yelp Camp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//Show login form route
router.get("/login", function(req, res){
    res.render("login");
});

//Landling login logic route
router.post("/login", passport.authenticate("local",
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login" 
    }), function(req, res){
});

//Logout route
router.get("/logout", function(req, res) {
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
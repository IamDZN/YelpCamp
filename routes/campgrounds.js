var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX Route - get all campgrounds from DB
router.get("/", function(req, res) {
    Campground.find({}, function(err, allcampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser : req.user});
        }
    });
});

//CREATE Route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    //Create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);            
        } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds" );
        }        
    })   
});

//NEW Route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});

//SHOW Route - show more information about one campground
router.get("/:id", function(req, res){
       
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        }else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
            /* Campground.find({}, function(err, allCamps) {
                res.render("campgrounds/show", {campground: foundCampground, allcamps : allCamps});
            }); */
        }
    }); 
});

//EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});        
    });
});

//UPDATE Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){    
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndDelete(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
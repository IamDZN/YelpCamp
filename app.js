var express                 = require('express'),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seed");

//Requiring Routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//DB Configurations 
// Local   
//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// mLab
//mongoose.connect("mongodb://dzn:rangi2018@ds151228.mlab.com:51228/yelpcamp", { useNewUrlParser: true });

var dbUrl = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(dbUrl, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));

//View Engine Configurations
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));
app.use(flash());

//Seeding the DB
//seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret : "Once again Rusty wins cutest dog!",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This code executed before every route and added to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Requiring Route Files
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);


//Heroku Port & IP configs
var app_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var app_host = process.env.YOUR_HOST || '0.0.0.0';

//Tell Express to listen for requests(start server)
/* app.listen(3000, app_host ,function(){
    console.log("The YelpCamp Server Has Started Serving on PORT 3000...");
});
 */

//Heroku app.listen()
app.listen(app_port, app_host, function() {
console.log('Listening on port ' +  app_port);
});
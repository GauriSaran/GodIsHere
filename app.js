console.log("Going to read express file:");
var express = require("express");
console.log("Finished reading express file");
console.log("Going to execute function pointed by express variable");
var app = express();
console.log("Finished executing function pointed to by express variable");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Comment = require("./models/comments");
var User = require("./models/user");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var pilgrimageRoutes = require("./routes/pilgrimages");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});


app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride("_method"));

app.use(flash());

app.set("view engine", "ejs");

//if(cuurentUser && campground.author.id.equals(cuurentUser._id)){ 
    //this code allows only the users who created the campground to be able to see edit and delete buttons on show page
//Passport CONFIRGUATION
app.use(require("express-session")({
    secret:"Hanumanji is true devotee",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){                //this is the middleware for every single route
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use(pilgrimageRoutes);
app.use(commentRoutes);






app.listen(2800, function(){
    console.log("starting server on 2800");
})
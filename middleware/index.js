var Pilgrimage = require("../models/pilgrimages")
var Comment = require("../models/comments")



var middlewareObj = {}


middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first"); //error is key and Please log in first is value
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership= function(req, res, next){
    if(req.isAuthenticated()){
        Pilgrimage.findById(req.params.id, function(err, foundPilgrimage){
            if(err){
                res.redirect("back");
            }else{
                if(foundPilgrimage.author.id.equals(req.user._id)){
                    next();
                }else {
                    res.redirect("back");
                }
            }
        })
    }
}


middlewareObj.checkCommentOwnership= function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else {
                    res.redirect("back");
                }
            }
        })
    }
}

module.exports = middlewareObj;


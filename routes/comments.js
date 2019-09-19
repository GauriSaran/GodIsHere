var express = require("express");

var router = express.Router();
var Pilgrimage = require("../models/pilgrimages");
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Pilgrimage.findById(req.params.id, function(err, foundPilgrimage){
        if(err){
            req.flash("error", "You have to login to do that")
            console.log(err);
        }else {
            res.render("comments/new", {pilgrimage: foundPilgrimage});
        }
    })
})



router.post("/pilgrimages/:id/comments", middleware.isLoggedIn, function(req, res){
   Pilgrimage.findById(req.params.id, function(err, pilgrimage){
       if(err){
           console.log(err);
       }else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "You have to log in to do that")
                   console.log(err);
               } else {
                   console.log("New user username is: "+ req.user.username);
                   comment.author.id = req.user._id
                   comment.author.username = req.user.username;
                   comment.save();
                   pilgrimage.comments.push(comment);
                   pilgrimage.save();
                   res.redirect('/pilgrimages/' + pilgrimage._id);
               }
           })
       }
   })
})

router.get("/pilgrimages/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back")
        }else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                req.flash("error", "You don't have permission to do that")
                if(err){
                    res.redirect("back");
                }else {
                    res.render("comments/edit", {comment: foundComment, pilgrimage: foundPilgrimage});
                }
        })
    }
    })
   
    });

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }

    })
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
    
})







module.exports= router;
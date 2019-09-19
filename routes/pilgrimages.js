var express = require("express");

var router = express.Router();
var Pilgrimage = require("../models/pilgrimages");
var middleware = require("../middleware");

router.get("/pilgrimages", function(req, res){
    Pilgrimage.find({}, function(err, allPilgrimages){
        if(err){console.log(err)}
        else{
            res.render("pilgrimages/index", {pilgrimage:allPilgrimages});
        }
    });
});

router.post("/pilgrimages", middleware.isLoggedIn, function(req, res){
    var name1 = req.body.name;
    var image1 = req.body.image;
    var desc = req.body.description;
    var author= {
        id: req.user._id,
        username: req.user.username
    }
    var newPilgrimage = {name: name1, image: image1, description: desc, author: author};
    
    Pilgrimage.create(newPilgrimage, function(err, newlyCreated){
        
        if(err){
            req.flash("error", "You need to be logged in")
            console.log(err)
        }else{
             res.redirect("pilgrimages");
        }
    });
});

router.get("/pilgrimages/new", middleware.isLoggedIn, function(req, res){
        res.render("pilgrimages/new");
    });
   


router.get("/pilgrimages/:id", function(req,res){
    Pilgrimage.findById(req.params.id).populate("comments").exec(function(err, foundPilgrimage){
        if(err){
            console.log(err)}
        else{
            res.render("pilgrimages/show",{pilgrimage: foundPilgrimage});
        }
    });
});

router.get("/pilgrimages/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Pilgrimage.findById(req.param.id, function(err, foundPilgrimage){
        if(err){
            req.flash("error", "You don't have permission to do that")
            res.redirect("/pilgrimages")
        } else {
            res.render("pilgrimages/edit", {pilgrimage: foundPilgrimage});
        }
    });
});

router.put("/pilgrimages/:id", middleware.checkCampgroundOwnership, function(req, res){
    
    Pilgrimage.findByIdAndUpdate(req.params.id, req.body.pilgrimage, function(err, updatedCampground){
        if(err){
            res.redirect("/pilgrimages");
        }else {
            res.redirect("/pilgrimages/"+ req.params.id);
        }
    });
});
router.delete("/pilgrimages/:id", middleware.checkCampgroundOwnership, function(req, res){
    Pilgrimage.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/pilgrimages");
        }else {
            res.redirect("/pilgrimages");
        }
    });
});

module.exports = router;
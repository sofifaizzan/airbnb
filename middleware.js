const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn = (req,res,next) =>{
    console.dir(req.isAuthenticated())
    console.log(req.path, "+", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error","you must be logedin first to add listing");
        return res.redirect("/user/login")
    }else{
        next();
    }
    
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl)
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let checklisting = await Listing.findById(id);
    if(!checklisting.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not an Owner of this listings");
        res.redirect("/listings/"+id)
        return;
    }
    next();
}
module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    console.log(req.params)
    let checkReview = await Review.findById(reviewId);
    console.log(checkReview)
    if(!checkReview.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not an author of this review");
        res.redirect("/listings/"+id)
        return;
    }
    next();
}
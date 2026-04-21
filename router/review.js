const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js')
const {reviewSchema} = require('../schema.js')

const {isLoggedIn} = require('../middleware.js');
const {isReviewAuthor} = require('../middleware.js');
const ExpressError = require('../utils/ExpressError.js')
const reviewsController = require("../controllers/reviews.js");
//  save the reviews
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    // console.log(r)
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}
//save reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewsController.createReviews))
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewsController.distroyReviews))

module.exports = router;
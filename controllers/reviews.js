const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReviews = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    console.log(req.body)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review added");
    await res.redirect(`/listings/${id}`)
}
module.exports.distroyReviews=async(req,res)=>{
    let{id,reviewId} = req.params;
    let deleteId =await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    let deleteReview = await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted");
    await res.redirect(`/listings/${id}`)
}
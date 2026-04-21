const express = require("express");


const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema,reviewSchema} = require('../schema.js')
const {isLoggedIn,isOwner} = require('../middleware.js');

const listingController = require("../controllers/listings.js");

const router = express.Router();
const multer  = require('multer')

const {storage} = require("../cloudconfig.js")
const upload = multer({ storage })

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    // console.log(r)
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

//  SHOW ROUTE
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('Listing[image]'),validateListing, wrapAsync(listingController.createlisting))

// UPDATE Listing    
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.post(isLoggedIn,upload.single('Listing[image]'),validateListing,isOwner, wrapAsync(listingController.updateListing));

// NEW route
router.get("/add/new",isLoggedIn,listingController.renderNewForm)


// EDIT route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

// delete route 
router.post("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.distroyListing));



module.exports = router;
if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}


console.log(process.env.SECRET)
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require('path')
const ejs = require("ejs");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js')
var methodOverride = require('method-override')
const listingRouter = require('./router/listing.js')
const reviewRouter = require('./router/review.js')
const userRouter = require('./router/user.js')


app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))

// using flash
const flash = require('connect-flash')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const User = require("./models/user.js")

// ------------------------------------
// session initilize
const session = require('express-session')
const sessionoptinons = {
    secret:"mysuppersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires:Date.now() * 7 *24 * 60 * 6 * 1000,
        maxAge: 7 *24 * 60 * 6 * 1000,
        httponly: true
    },
};


app.use(session(sessionoptinons));

//----------------------------------
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('session'));
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}
main().then(()=>{
    console.log("mongoo connectes")
}).catch(()=>{
    console.log("mongoo not connectes")
})
app.get("/",(req,res) => {
    res.redirect("/listings");
})


app.use((req,res,next) => {
    console.log(req.path);

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
})

// app.get("/listings", wrapAsync(async (req,res)=>{
//     let allListings= await Listing.find({});
//     res.render("listings/index.ejs",{allListings})
// }));

// //  SHOW ROUTE
// app.get("/listings/:id",wrapAsync(async (req,res) => {
//     let {id} = req.params;
//     const listing =await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing})
// }));

// // NEW route
// app.get("/listings/add/new",(req,res) => {
//     res.render("listings/new.ejs")
// })

//save in db new
// app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
   
//     console.log(req.body.Listing)
//     let newListing = new Listing(req.body.Listing);
//     await newListing.save();
//     res.redirect("/listings")



//     // const {title, description,image,price,location,country} = req.body
//     // const saveform = new Listing({
//     //     title : title,
//     //     description : description,
//     //     image : image,
//     //     price : price,
//     //     location : location,
//     //     country : country,

//     // })
//     // await Listing.insertMany(saveform);
//     // console.log("done")
//     // res.send("done ")
// }));

// // EDIT route
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing =await Listing.findById(id);
//     res.render(`listings/edit.ejs`,{listing})
// }))
// app.post("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     console.log(req.body.Listing)
//     let save_ = await Listing.findByIdAndUpdate(id,{...req.body.Listing});
//     console.log(save_)
//     res.redirect("/listings/"+id);
// }));
// // delete route 
// app.post("/listing/:id/delete",wrapAsync(async (req,res)=>{
//     let {id} = req.params
//     let delete_ = await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");

// }));
// //  save the reviews
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     let newReview = new Review(req.body.review);
//     console.log(req.body)
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     await res.redirect(`/listings/${id}`)
    


// }))
// //delete review route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let{id,reviewId} = req.params;
//     let deleteId =await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
//     let deleteReview = await Review.findByIdAndDelete(reviewId)
//     await res.redirect(`/listings/${id}`)
// }))

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/user",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    console.log(err)
    let {statusCode=500,message="something went wrong"} = err;
    // res.status(statusCode).send(message)
    res.status(statusCode).render("listings/error.ejs",{err})
    // res.send("something went wrong")
})
app.listen(8080,() => {
    console.log("server is listening at 8080");
})

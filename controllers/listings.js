const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm = (req,res) => {
    
    
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing =await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing not found");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.createlisting = async (req,res,next)=>{
   
    let url = req.file.path
    let filename = req.file.filename
    let newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    await newListing.save();
    await req.flash("success","New listing created");
    await res.redirect("/listings")
    // const {title, description,image,price,location,country} = req.body
    // const saveform = new Listing({
    //     title : title,
    //     description : description,
    //     image : image,
    //     price : price,
    //     location : location,
    //     country : country,

    // })
    // await Listing.insertMany(saveform);
    // console.log("done")
    // res.send("done ")
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found");
        res.redirect("/listings")
    }
    // compressing image with the help of cloudenary api;
    let orginalImageUrl = listing.image.url;
    orginalImageUrl=orginalImageUrl.replace("/upload","/upload/h_300,w_250")

    res.render(`listings/edit.ejs`,{listing,orginalImageUrl })
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
 
  
    let saveListing = await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        saveListing.image = {url,filename}
        await saveListing.save()
    }
    
    req.flash("success"," listing updated");
    
    res.redirect("/listings/"+id);
}

module.exports.distroyListing = async (req,res)=>{
    let {id} = req.params
    let delete_ = await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted");
    res.redirect("/listings");

}
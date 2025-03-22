const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const{isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    if(error){
     throw new ExpressError(400, error);
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    //console.log(allListings);
    res.render("listings/index.ejs",{allListings})
 }));
 
 //New Route
 router.get("/new",isLoggedIn, wrapAsync(async (req,res)=>{
    
     res.render("listings/new.ejs");
 }));
 
 //Show Route
 router.get("/:id", wrapAsync(async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
     }
     res.render("listings/show.ejs",{listing});
 }));
 
 //Create Route
 router.post("/", validateListing ,isLoggedIn,wrapAsync(async(req,res,next)=>{
    // let {title,description,price,image,location,country} = req.body;
    //let listing = req.body;
    //console.log(listing);
 
    
     console.log("Received Data:", req.body);
     const newListing = new Listing(req.body.listing);
     
     await newListing.save();
     req.flash("success", "New Listing Created!");
     res.redirect("/listings");
 })
 );
 
 // edit route
 router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
     }
     res.render("listings/edit.ejs", { listing });
   }));
   
   // update route
   router.put("/:id",validateListing, isLoggedIn,wrapAsync(async (req, res) => {
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success", "Listing Updated!");
     res.redirect(`/listings/${id}`);
   }));
   
   
   // delete route
   router.delete("/:id",isLoggedIn, wrapAsync( async (req, res) => {
     let { id } = req.params;
     const deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
   }));
   
   module.exports = router;
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    //console.log(allListings);
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ 
        path: "reviews", 
        populate: { 
            path: "author",
         } ,
        })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    // let {title,description,price,image,location,country} = req.body;
    //let listing = req.body;
    //console.log(listing);

    console.log("Received Data:", req.body);
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;

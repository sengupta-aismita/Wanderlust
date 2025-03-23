const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router.route("/")
.get( wrapAsync(listingController.index))
.post(
    validateListing,
    isLoggedIn,
    wrapAsync(listingController.Post)
  );

  //New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.newForm));

  router.route("/:id")
  .get( wrapAsync(listingController.showPage))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editPost)
  );

module.exports = router;

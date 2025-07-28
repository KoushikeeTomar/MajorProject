const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing=require("../Models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner,validateListing}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
const listingController = require("../controllers/listing.js");

// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/")
.get ( wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing));
// multer will send image data to req.file via upload.single md
// and then we'll execute createlisting callback in controller
// .post(upload.single("listing[image]"),(req,res) => {
//     res.send(req.file);
// })

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// index Route
// router.get ("/", wrapAsync(listingController.index));


// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

// Edit Route
// firstly listing will be validated and after that rest of the work will be done.
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;
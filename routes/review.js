const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Review=require("../Models/review.js");
const Listing=require("../Models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController = require("../controllers/review.js");


// reviews posting review
// review route. passing validateReview as a middleware.
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Deleting reviews route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
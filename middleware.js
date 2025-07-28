const Listing = require("./Models/listing.js");
const Review = require("./Models/review.js");
const {listingSchema}=require("./schema.js");
const expressError=require("./utils/expressError.js");
const {reviewSchema}=require("./schema.js");

function isLoggedIn(req,res,next)  {
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
} 

function saveRedirectUrl(req, res, next) {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports = { isLoggedIn, saveRedirectUrl };

module.exports.isOwner = async (req,res,next) => {
     let {id}=req.params;
     let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// /so that we can pass validateListing as a md
module.exports.validateListing=(req,res,next)=>{
    // validating listingSchema frm req.body and err is extracted frm that.
    let {error}=listingSchema.validate(req.body);
    // throwing new expressError for error received.
    if(error){
        // mapping all prop of err obj
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

// Validating review schema too used in joi.
module.exports.validateReview=(req,res,next)=>{
    // validating listingSchema frm req.body and err is extracted frm that.
    let {error}=reviewSchema.validate(req.body);
    // throwing new expressError for error received.
    if(error){
        // mapping all prop of err obj
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

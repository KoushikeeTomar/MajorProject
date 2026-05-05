const Listing = require("../Models/listing.js");

module.exports.index = async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate: {
            path:"author",
        },
    })
    .populate("owner");
    console.log(listing.owner);
    if(!listing){
        req.flash("error","Listing you searched for does not exist");
        res.redirect("/listings");
    }
     console.log("💡 Owner populated:", listing.owner);
     listing.geometry = {
        type: "Point",
        coordinates: [77.1025, 28.7041] // Delhi
    };
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you searched for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_256");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    // if(!(req.body.listing)){
    //         throw new expressError(400,"send valid data for listing");
    //     }
    let {id}=req.params;
    // Authorization:
    // let listing = await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","You don't have permission to edit ");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file==="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};
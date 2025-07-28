if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./Models/listing.js");
const ejsMate=require("ejs-mate");
const path=require("path");
const { constants } = require("buffer");
const app=express();
const methodOverride=require("method-override");
const wrapAsync=require("./utils/wrapAsync.js");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./Models/review.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");
const {isLoggedIn,saveRedirectUrl}=require("./middleware.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl = process.env.ATLAS_DB_URL;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("error on mongo store", err);
});

sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const port=3000;

// const MONGO_URL='mongodb://127.0.0.1:27017/WanderLust';

async function main() {
    await mongoose.connect(dbUrl);
}
// now mongoose will connect not on our local system but will connect on our atlas db.
// we'll be unable to see all listings since connection in on atlas db but db initialization is done on localhost.

main()
.then(res=>{
    console.log("Connected to DB");
})
.catch(err =>{
    console.log(err);
});

app.use(flash());

app.use((req,res,next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log(res.locals.success);
    next();
});

// making fake user and then registering it via register method.
// app.get("/DemoUser", async (req,res) => {
//     let fakeUser = new User({
//         email:"abc@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);




// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("Document is saved");
//     res.send("Successful Testing!");
// });

// app.get("/",(req,res)=>{
//     res.send("Hi! I am root");
// });

// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"Page not found"));
// });

// err handling md
app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"}=err;
    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs",{message,err});
});

app.listen(port,()=>{
    console.log(`server is listening on port no. ${port}`);
});
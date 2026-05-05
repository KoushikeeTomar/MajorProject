if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const expressError = require("./utils/expressError.js");
const User = require("./Models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
app.set("trust proxy", 1);

// ================== BASIC SETUP ==================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================== ENV VARIABLES ==================
const dbUrl = process.env.ATLAS_DB_URL;
const port = process.env.PORT || 3000;

// ================== START SERVER ==================
async function startServer() {
    try {
        // 🔴 Check ENV
        if (!dbUrl) {
            console.error("❌ ATLAS_DB_URL is missing");
            process.exit(1);
        }

        // 🔗 Connect DB
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to MongoDB");

        // ================== SESSION STORE ==================
        const store = MongoStore.create({
            mongoUrl: dbUrl,
            crypto: {
                secret: process.env.SECRET,
            },
            touchAfter: 24 * 3600,
        });

        store.on("error", (err) => {
            console.log("MongoStore error:", err);
        });

        const sessionOptions = {
            store: store,
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            },
        };

        app.use(session(sessionOptions));
        app.use(flash());

        // ================== PASSPORT ==================
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        // ================== GLOBAL MIDDLEWARE ==================
        app.use((req, res, next) => {
            res.locals.success = req.flash("success");
            res.locals.error = req.flash("error");
            res.locals.currUser = req.user;
            next();
        });

        // ================== ROUTES ==================
        app.use("/listings", listingsRouter);
        app.use("/listings/:id/reviews", reviewsRouter);
        app.use("/", userRouter);

        // ================== ERROR HANDLER ==================
        app.use((err, req, res, next) => {
            let { status = 500, message = "Something went wrong" } = err;
            res.status(status).render("listings/error.ejs", { message, err });
        });

        // ================== START LISTEN ==================
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });

    } catch (err) {
        console.log("❌ Failed to start server:", err);
    }
}

startServer();
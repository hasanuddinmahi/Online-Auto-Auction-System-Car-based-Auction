// logic to do not upload credentials
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// set session on cookie
const sessionOption = {
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

const MONGO_URL = "mongodb://127.0.0.1:27017/CarAuction";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console, log(err);
    })



// using session middleware
app.use(session(sessionOption));
app.use(flash());

// using passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// using for user information added in the session and also for removing from the session 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// access session data in res.local variable
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "abcw",
//         phoneNumber: "03267327",
//         location: "hgasdja",

//     });
//     password = "1234";
// console.log(password);
//     let registerUser = await User.register(fakeUser, password);

//     res.send(registerUser);
// });

app.get("/homepage", (req, res) => {
    res.render("homepage.ejs");
});

// Admin Router
app.use("/admin", adminRouter);

// Listing Router
app.use("/listings", listingRouter);

// User Router
app.use("/", userRouter);


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         condition: "used",
//         carType: "petrol",
//         registrationType: "private",
//         registrationDate: "12-6-2013",
//         brandModel: "BMW M3",
//         mileage: 12000,
//         year: 2013,
//         seat: 4,
//         color: "Black",
//         title: "BMW",
//         description: "used car",
//         price: 30000,
//         location: "Cyberjaya, Selangor",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// Unknown Page Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handeling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
}); 
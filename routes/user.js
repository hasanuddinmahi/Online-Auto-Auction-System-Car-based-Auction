const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn, validateComplain } = require("../middleware.js");
const Listing = require("../models/listing.js");
const Complain = require("../models/complain.js");

// User signup form page
router.get("/register", (req, res) => {
    res.render("users/register.ejs");
});

// Submit user signup form
router.post("/register", wrapAsync(async (req, res) => {
    try {
        let { username, email, phoneNumber, location, password } = req.body;
        const newUser = new User({ username, email, phoneNumber, location });
        const registerUser = await User.register(newUser, password);

        // automatically login
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome There");
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }

}));

// User login form page
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Submit the login form && authenticate user
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", `Welcome Back ${req.user.username}`);
    let redirectUrl;
    if (req.user._id == '662e1874d4fbf3b3c0b96edb') {
        redirectUrl = "/admin/manageListings";
    } else {
        redirectUrl = res.locals.redirectUrl || "/listings";
    }
    res.redirect(redirectUrl);
});

// logout user
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out");
        res.redirect("/login");
    })
});


// Profile setting
router.get("/profile", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user;
    res.render("users/profile.ejs", { user });
}));


// Account delete
router.delete("/delete/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.deleteMany({ owner: id });
    await Complain.deleteMany({ owner: id });
    await User.findByIdAndDelete(id);

    req.flash("success", "Account Deleted");
    res.redirect("/register");
}));


//create complain page
router.get("/complaint", isLoggedIn, (req,res)=>{
    res.render("users/complaint.ejs");
});

//submit create complain form
router.post("/complaint", isLoggedIn, validateComplain, wrapAsync(async(req,res)=>{
    const newComplain = new Complain(req.body.complain);
    
    newComplain.owner = req.user._id;

    await newComplain.save();
    req.flash("success", "Complaint Send");
    res.redirect("/complaint");
}));

module.exports = router;
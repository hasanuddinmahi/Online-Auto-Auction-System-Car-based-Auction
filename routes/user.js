const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

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
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

// logout user
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out");
        res.redirect("/listings");
    })
});


// Profile setting
router.get("/profile", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user;
    res.render("users/profile.ejs", { user });
}));

module.exports = router;
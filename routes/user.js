const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const { saveRedirectUrl, isLoggedIn, validateComplain } = require("../middleware.js");
const WatchList = require("../models/watchList.js");
const Listing = require("../models/listing.js");
const Complain = require("../models/complain.js");
const Bid = require("../models/bid.js");
const Notify = require("../models/notification.js");
const Review = require("../models/review.js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
    const msg = {
        to: email,
        from: 'auctionhm1@gmail.com',
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    await sgMail.send(msg);
};

// User signup form page
router.get("/register", (req, res) => {
    res.render("users/register.ejs");
});

// Function to generate a 6-digit numeric OTP
const generateNumericOTP = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString();
};

// Register route
router.post("/register", wrapAsync(async (req, res) => {
    try {
        let { username, email, phoneNumber, location, password } = req.body;
        const otp = generateNumericOTP();

        // Store user data and OTP in session
        req.session.tempUser = { username, email, phoneNumber, location, password, otp };

        // Send OTP to user's email
        await sendOTPEmail(email, otp);

        req.flash("success", "OTP sent to your email. Please verify to complete registration.");
        res.redirect(`/verify?email=${encodeURIComponent(email)}`);

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
}));

// Render OTP verification page
router.get("/verify", (req, res) => {
    res.render("users/verify.ejs", { email: req.query.email });
});

// Verify OTP and create user
router.post("/verify", wrapAsync(async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Retrieve user data from session
        const tempUser = req.session.tempUser;

        if (!tempUser || tempUser.email !== email) {
            req.flash("error", "Invalid email or OTP");
            return res.redirect("/register");
        }

        if (tempUser.otp !== otp) {
            req.flash("error", "Invalid OTP");
            return res.redirect(`/verify?email=${encodeURIComponent(email)}`);
        }

        // Create the new user
        const newUser = new User({
            username: tempUser.username,
            email: tempUser.email,
            phoneNumber: tempUser.phoneNumber,
            location: tempUser.location
        });
        const registerUser = await User.register(newUser, tempUser.password);

        // Clear temporary user data from session
        req.session.tempUser = null;

        // OTP verified, login user
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome There");
            res.redirect("/listings");
        });

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

//Change Phone Number
router.post('/changePhoneNumber', isLoggedIn, wrapAsync(async (req, res) => {
    const newNumber = req.body.newNumber;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { phoneNumber: newNumber }, { new: true });
    res.redirect('/profile');
}));

//Change Nationality
router.post('/changeNationality', isLoggedIn, wrapAsync(async (req, res) => {
    const newNationality = req.body.nationality;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { nationality: newNationality }, { new: true });
    res.redirect('/profile');
}));

// Change the password
router.post('/changePassword', isLoggedIn, wrapAsync(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        req.flash("error", "New passwords do not match");
        return res.redirect('/profile');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect('/profile');
    }

    user.authenticate(currentPassword, async (err, authenticatedUser, passwordErr) => {
        if (err || passwordErr || !authenticatedUser) {
            req.flash("error", "Current password is incorrect");
            return res.redirect('/profile');
        }

        // Set the new password
        authenticatedUser.setPassword(newPassword, async (err) => {
            if (err) {
                req.flash("error", "Error setting new password");
                return res.redirect('/profile');
            }

            // Save the user with the new password
            await authenticatedUser.save();
            req.flash("success", "Password changed successfully");
            res.redirect('/profile');
        });
    });
}));


// Account delete
router.delete("/delete/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    // Delete listings
    await Listing.deleteMany({ owner: id });

    // Delete complaints
    await Complain.deleteMany({ owner: id });

    // Delete watchLists
    await WatchList.deleteMany({ user: id });

    // Delete notifications
    await Notify.deleteMany({ user: id });

    // Delete bids
    await Bid.deleteMany({ user: id });

    // Delete reviews
    await Review.deleteMany({ author: id });

    // Delete the user account
    await User.findByIdAndDelete(id);

    req.flash("success", "Account Deleted");
    res.redirect("/register");
}));


//create complain page
router.get("/complaint", isLoggedIn, (req, res) => {
    res.render("users/complaint.ejs");
});

//submit create complain form
router.post("/complaint", isLoggedIn, validateComplain, wrapAsync(async (req, res) => {
    const newComplain = new Complain(req.body.complain);

    newComplain.owner = req.user._id;

    await newComplain.save();
    req.flash("success", "Complaint Send");
    res.redirect(`/complaint/${newComplain._id}`);
}));

router.get("/complaint/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const complain = await Complain.findById(id).populate("owner");

    if (!complain) {
        req.flash("error", "complain that you requested for does not exist");
        res.redirect("/complaint");
    }
    res.render("users/complaintDetails.ejs", { complain });

}));

module.exports = router;
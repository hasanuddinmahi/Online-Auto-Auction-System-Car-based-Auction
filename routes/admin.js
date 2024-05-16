const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, validateListing, validateComplain } = require("../middleware.js");
const Complain = require("../models/complain.js");

//admin manage listings
router.get("/manageListings", isLoggedIn, async (req, res) => {
    const allListings = await Listing.find({}).populate('owner');
    res.render("admin/manageListings.ejs", { allListings });
});

//Create new Listing
router.get("/listings/new", isLoggedIn, (req, res) => {
    res.render("admin/createListing.ejs");
});

//submit create listing form
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.status = 'Approved';
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/admin/manageListings");
}));

//show Listing Details
router.get("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner").populate("image");
    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        res.redirect("/admin/manageListings");
    }
    res.render("admin/showDetails.ejs", { listing });
}));

// Accept Listing
router.post("/listings/:id/accept", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { status: 'Approved' }, { runValidators: true, new: true });
    req.flash("success", "Listing Accepted");
    res.redirect("/admin/manageListings");
}));

// Reject Listing
router.post("/listings/:id/reject", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { status: 'Disapproved' }, { runValidators: true, new: true });
    req.flash("success", "Listing Rejected");
    res.redirect("/admin/manageListings");
}));

// Delete listing
router.delete("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/admin/manageListings");
}));

// Admin manage users
router.get("/manageUsers", isLoggedIn, async (req, res) => {
    const allUsers = await User.find({});
    res.render("admin/manageUsers.ejs", { allUsers });
});

// Create User form page
router.get("/users/new", isLoggedIn, (req, res) => {
    res.render("admin/createUser.ejs");
});

// Submit create user form
router.post("/users", isLoggedIn, wrapAsync(async (req, res) => {
    try {
        let { username, email, phoneNumber, location, password } = req.body;
        const newUser = new User({ username, email, phoneNumber, location });
        const registerUser = await User.register(newUser, password);

        req.flash("success", "New User Added");
        res.redirect("/admin/manageUsers");

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/admin/users/new");
    }

}));

// Admin Delete users
router.delete("/users/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.deleteMany({ owner: id });
    await Complain.deleteMany({ owner: id });
    await User.findByIdAndDelete(id);

    req.flash("success", "User Deleted");
    res.redirect("/admin/manageUsers");
}));


//Admin Customer support
router.get("/supportCustomer", isLoggedIn, async (req, res) => {
    const allComplain = await Complain.find({}).populate("owner");
    res.render("admin/supportCustomer.ejs", { allComplain });
});

//show Complain Details
router.get("/supportCustomer/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const complain = await Complain.findById(id).populate("owner");
    if (!complain) {
        req.flash("error", "Listing that you requested for does not exist");
        res.redirect("/admin/supportCustomer");
    }
    res.render("admin/complainDetails.ejs", { complain });
}));


//send complain reply
router.post("/supportCustomer/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let msg = req.body.complain.adminSend;

    await Complain.findByIdAndUpdate(id, { adminSend: msg }, { runValidators: true, new: true });
    await Complain.findByIdAndUpdate(id, { status: 'In Progress' }, { runValidators: true, new: true });
    req.flash("success", "Reply Sent");
    res.redirect(`/admin/supportCustomer/${id}`);
 
}));

//complete support
router.post("/supportCustomer/:id/complete", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Complain.findByIdAndUpdate(id, { status: 'complete' }, { runValidators: true, new: true });
    req.flash("success", "Issue Resolved");
    res.redirect(`/admin/supportCustomer/${id}`);

}));

module.exports = router;
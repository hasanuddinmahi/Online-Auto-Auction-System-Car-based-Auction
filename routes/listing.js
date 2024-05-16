const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfiq.js");
const upload = multer({ storage });

// All Listing route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//approve disapprove Listing Details
router.get("/allCar", isLoggedIn, wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    // show only owner car listing
    let listings = [];
    for (let listing of allListings) {
        if (req.user && req.user._id.equals(listing.owner._id)) {
            listings.push(listing);
        }
    }

    res.render("listings/approveDisapprove.ejs", { listings });
}));

// watchlist Listing
router.get("/watchList", isLoggedIn, wrapAsync(async (req, res) => {
    let id = req.user._id;
    const user = await User.findById(id).populate("watchLists");
    const allListings = user.watchLists;
    res.render("listings/watchList.ejs", { allListings });
}));


//Create new Listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/createform.ejs");
});

//submit create listing form
router.post('/', isLoggedIn, upload.array('listing[image]', 8), validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    const files = req.files;

    // image upload
    const images = [];
    for (let file of files) {
       newListing.image.push({
            url: file.path,
            filename: file.filename,
        });
    }

    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));


//show Listing Details
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    // check for the watchList button
    let checkListing = false;
    if (req.user) {
        const user = await User.findById(req.user._id).populate("watchLists");
        const watchLists = user.watchLists;
        for (let list of watchLists) {
            if (listing.id == list._id) {
                checkListing = true;
            }
        }
    }
    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing, checkListing });
}));


//Edit Listings form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update the listing
router.put("/:id", isLoggedIn, isOwner, upload.array('listing[image]', 8), validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // image edit
    const files = req.files;
    if (typeof files !== 'undefined') {
        let save;
        for (let file of files) {
            listing.image.push({
                url: file.path,
                filename: file.filename,
            });
        }

        await listing.save();
    }
    
    await Listing.findByIdAndUpdate(id, { status: 'pending' }, { runValidators: true, new: true });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// Delete the listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

//Added to the watchList Post request
router.post('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // check watchLists listings
    const user = await User.findById(req.user._id).populate("watchLists");
    const allListings = user.watchLists;
    for (let list of allListings) {
        if (listing.id == list._id) {
            req.flash("error", "Listing already added");
            return res.redirect(`/listings/${id}`);
        }
    }

    req.user.watchLists.push(listing);
    await req.user.save();
    req.flash("success", "Listing have been added to the watchList");
    res.redirect(`/listings/${id}`);

}));

//Delete from the watchList
router.delete('/watchList/:id', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const user = await User.findById(req.user._id).populate("watchLists");
    const allListings = req.user.watchLists.filter(list => list._id != listing.id);

    await User.findByIdAndUpdate(req.user._id, { watchLists: allListings }, { runValidators: true, new: true });
    res.redirect("/listings/watchList");
}));

module.exports = router;
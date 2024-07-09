const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const WatchList = require("../models/watchList.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfiq.js");
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// All Listing route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    const query = req.query;
    let notFound = false;
    res.render("listings/index.ejs", { allListings, query, notFound });
}));

// refine search 
router.get('/search', async (req, res) => {
    const { year, brandModel, minPrice, maxPrice, color } = req.query;

    let query = { $or: [{ status: 'Approved' }, { status: 'auction' }] };

    if (brandModel) {
        const firstWord = brandModel.trim().split(' ')[0].toLowerCase();
        query.brandModel = { $regex: new RegExp('^' + firstWord, 'i') };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (color) query.color = color;
    if (year) query.year = Number(year);

    try {
        const filteredListings = await Listing.find(query);

        // Render the response with a check for listings
        res.render('listings', {
            allListings: filteredListings,
            query: req.query,  // Pass the query parameters to the template
            notFound: filteredListings.length === 0  // Pass notFound flag to template
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.redirect('/listings');
    }
});


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

// watchList Listing
router.get("/watchList", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user.id;
    const findWatch = await WatchList.find().populate("listing");

    let allListings = [];
    for (let list of findWatch) {
        if (list.user == user) {
            if (list.listing && list.listing.status != 'finished') {
                allListings.push(list.listing);
            }
        }
    }
    res.render("listings/watchList.ejs", { allListings });
}));


//Create new Listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/createform.ejs");
});

//submit create listing form
router.post('/', isLoggedIn, upload.array('listing[image]', 8), validateListing, wrapAsync(async (req, res) => {

    const { state = "Selangor", city = "Kuala Lumpur", houseOrRoadName, ...otherListingData } = req.body.listing;
    let location = `${req.body.listing.location.houseOrRoadName}, ${req.body.listing.location.city}, ${req.body.listing.location.state}, Malaysia`;

    let response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
    })
        .send();


    const newListing = new Listing({
        location: { state, city, houseOrRoadName },
        ...otherListingData,
    });

    const files = req.files;

    // Handle image upload
    const images = [];
    for (let file of files) {
        images.push({
            url: file.path,
            filename: file.filename,
        });
    }
    newListing.image = images;

    // Set owner of the listing
    newListing.owner = req.user._id;

    // save geometry
    newListing.geometry = response.body.features[0].geometry;

    // Save the new listing
    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings/allCar");
}));


//show Listing Details
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");

    // check for the watchList button
    let checkListing = false;
    if (req.user) {
        let user = req.user._id;
        const watchLists = await WatchList.find({ user }).populate("listing");
        for (let list of watchLists) {
            if (list.listing && list.listing.id == listing.id) {
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

    // check status
    if (listing.status === "auction" || listing.status === "finished" || listing.status === "complete") {
        req.flash("error", "You cannot edit this listing now.");
        return res.redirect("/listings/allCar");
    }

    // check listing
    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update the listing
router.put("/:id", isLoggedIn, isOwner, upload.array('listing[image]', 8), validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { state, city, houseOrRoadName, ...otherListingData } = req.body.listing;

    // Find the listing to be updated
    const listing = await Listing.findById(id);

    // check status
    if (listing.status === "auction" || listing.status === "finished") {
        req.flash("error", "You cannot edit this listing now.");
        return res.redirect("/listings/allCar");
    }

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings/allCar");
    }

    // Update the location fields if provided
    if (state) listing.location.state = state;
    if (city) listing.location.city = city;
    if (houseOrRoadName) listing.location.houseOrRoadName = houseOrRoadName;

    // Update other listing fields
    for (let key in otherListingData) {
        listing[key] = otherListingData[key];
    }

    // Handle new images upload
    const files = req.files;
    if (files && files.length > 0) {
        const images = files.map(file => ({
            url: file.path,
            filename: file.filename
        }));
        listing.image.push(...images);
    }

    await listing.save();

    // pending after update
    await Listing.findByIdAndUpdate(id, { status: 'pending' }, { runValidators: true, new: true });

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// Delete the listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // check status
    if (listing.status === "auction" || listing.status === "finished" || listing.status === "complete") {
        req.flash("error", "You cannot delete this listing now.");
        return res.redirect("/listings/allCar");
    }

    // check listing
    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        return res.redirect("/listings");
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings/allCar");
}));

//Added to the watchList Post request
router.post('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let user = req.user._id;
    let listing = await Listing.findById(id);
    let watchLists = await WatchList.find();
    let { source } = req.query;

    // check watchLists listings
    if (!user.equals(listing.owner._id)) {

        // Check listing status
        if (listing.status !== 'Approved' && listing.status !== 'auction') {
            req.flash("error", "You cannot add this car to the watchList at this moment");
            return res.redirect(`/listings/${id}`);
        }

        for (let list of watchLists) {
            if (list.user.equals(user)) {
                if (listing.id == list.listing) {
                    req.flash("error", "Listing already added");
                    return res.redirect(`/listings/${id}`);

                }
            }

        }

        let newWatchList = await WatchList({
            user: user,
            listing: listing.id
        });

        await newWatchList.save();
        req.flash("success", "Listing have been added to the watchList");

        if (source === 'auction') {
            return res.redirect(`/auctions/listings/${id}`);
        } else {
            return res.redirect(`/listings/${id}`);
        }
    }
    else {
        req.flash("error", "Owners cannot add their own listing to the watchlist");
        if (source === 'auction') {
            return res.redirect(`/auctions/listings/${id}`);
        } else {
            return res.redirect(`/listings/${id}`);
        }
    }

}));

//Delete from the watchList
router.delete('/watchList/:id', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let user = req.user._id;
    let source = req.query.source;

    // Find and delete the specific watchList
    await WatchList.findOneAndDelete({ user: user, listing: listing._id });
    
    if (source === 'auction') {
        res.redirect(`/auctions/listings/${id}`);
    } else {
        res.redirect('/listings/watchList');
    }
}));

module.exports = router;
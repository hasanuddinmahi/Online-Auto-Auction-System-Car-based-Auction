const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Auction = require("../models/auction.js");
const Bid = require("../models/bid.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const { isLoggedIn, isOwner, validateListing, validateReview, ensureWinningBid } = require("../middleware.js");

// All Auction Listing Route
router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
    try {
        const getAuctions = await Auction.find({}).populate('auctionList');
        let user = req.user.id;

        // Check the listing owner with the logged-in user and show the list accordingly
        let allListings = [];
        for (let auction of getAuctions) {
            if (auction.status === "ongoing") {
                for (let listing of auction.auctionList) {
                    if (String(listing.owner._id) !== String(user)) {
                        allListings.push(listing);
                    }
                }
            }
        }

        if (allListings.length === 0) {
            req.flash("error", "Sorry! There is no auction going on now");
            return res.redirect('/listings'); // Redirect to a suitable page
        }

        const query = req.query;
        let notFound = false;
        res.render("auctions/index.ejs", { allListings, query, notFound });

    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).send('Error fetching auctions');
    }
}));

// Search Route for Auctions
router.get('/search', isLoggedIn, wrapAsync(async (req, res) => {
    const { year, brandModel, minPrice, maxPrice, color } = req.query;

    // Building the query object for auction listings
    let query = {};

    if (brandModel) {
        query.brandModel = { $regex: new RegExp('^' + brandModel, 'i') };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (color) query.color = color;
    if (year) query.year = Number(year);

    try {
        // Find auctions that match the criteria
        const auctions = await Auction.find({ status: 'ongoing' }).populate({
            path: 'auctionList',
            match: query
        });

        // Filter out listings that are not part of the auctions
        let filteredListings = [];
        for (let auction of auctions) {
            filteredListings = filteredListings.concat(auction.auctionList);
        }

        // Render the response with a check for listings
        res.render('auctions/index.ejs', {
            allListings: filteredListings,
            query: req.query,  // Pass the query parameters to the template
            notFound: filteredListings.length === 0  // Pass notFound flag to template
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send('Error fetching listings');
    }
}));



//show Listing Details
router.get("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let userId = req.user._id;

    // check for the user bid option
    let checkListing = false;
    if (listing.owner._id == req.user.id) {
        checkListing = true;
    }

    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        res.redirect("/auctions");
    }
    res.render("auctions/showDetails.ejs", { listing, checkListing, userId });
}));


// Place bids 
router.post('/listings/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const user = req.user; // Use req.user directly
    const bidAmount = parseFloat(req.body.bid.amount);
    const basePrice = parseFloat(listing.basePrice) + bidAmount;

    if (listing.status === 'auction') {
        const existingBid = await Bid.findOneAndUpdate(
            { listing: id, user: user._id }, // Access user ID from req.user
            { amount: basePrice },
            { new: true, runValidators: true, upsert: true }
        );

        await Listing.findByIdAndUpdate(id, { basePrice: basePrice }, { new: true, runValidators: true });

        req.flash('success', 'New bid added');
        res.redirect(`/auctions/listings/${id}`);
    } else {
        req.flash('error', 'Cannot bid right now');
        res.redirect(`/auctions/listings/${id}`);
    }
});

// All Bids 
router.get("/bids", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user.id;
    const findBis = await Bid.find().populate("listing");

    let allBids = [];
    for (let bid of findBis) {
        if (bid.user == user) {
            if (bid.listing.status == 'auction') {
                allBids.push(bid);
            }
        }
    }

    res.render("auctions/allBids.ejs", { allBids });
}));


// Bids Result
router.get("/bids/result", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user.id;
    const allBids = await Bid.find().populate("listing");

    let winBids = [];
    let loseBids = [];
    for (let bid of allBids) {
        if (bid.user == user) {
            if (bid.listing.status == 'finished') {
                if (bid.amount == bid.listing.basePrice) {
                    winBids.push(bid.listing);
                } else {
                    loseBids.push(bid.listing);
                }
            }
        }
    }

    res.render("auctions/bidsResult.ejs", { winBids, loseBids });
}));

// Bids Result Listing Details
router.get("/bids/result/:id", isLoggedIn, wrapAsync(ensureWinningBid), wrapAsync(async (req, res) => {
    const listing = req.listing;
    res.render('auctions/resultDetails.ejs', { listing });
}));

//submit review form
router.post("/bids/result/:id/review", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');
    let newReview = new Review(req.body.review);
    const user = req.user;
    newReview.author = user;

    //review for listing
    listing.review = newReview;
    await listing.save();

    //review added to the seller
    const owner = listing.owner;
    owner.reviews.push(newReview);
    await owner.save();
    await newReview.save();

    res.redirect(`/auctions/bids/result/${id}`);
}));

//seller details
router.get("/seller/:id", async (req, res) => {
    let { id } = req.params;
    const user = await User.findById(id).populate({ path: 'reviews', populate: { path: 'author' } });
    console.log(user)
    res.render("auctions/sellerDetails.ejs", { user });
});

module.exports = router;
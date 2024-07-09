const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Auction = require("../models/auction.js");
const Bid = require("../models/bid.js");
const Review = require("../models/review.js");
const WatchList = require("../models/watchList.js");
const User = require("../models/user.js");
const { isLoggedIn, validateReview, ensureWinningBid } = require("../middleware.js");

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
        res.redirect('/listings');
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
        query.basePrice = {};
        if (minPrice) query.basePrice.$gte = Number(minPrice);
        if (maxPrice) query.basePrice.$lte = Number(maxPrice);
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
        res.redirect('/listings');
    }
}));



//show Listing Details
router.get("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');

    if (!listing) {
        req.flash("error", "Listing that you requested for does not exist");
        return res.redirect("/auctions");
    }

    // Check listing status
    if (listing.status == "Approved" || listing.status == "Disapproved") {
        req.flash("error", "This listing does not added to the auction");
        return res.redirect("/auctions");
    }

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

    let userId = req.user._id;
    let checkOwner = listing.owner._id.equals(req.user._id);

    res.render("auctions/showDetails.ejs", { listing, checkListing, checkOwner, userId, bidCount: listing.bidCount });
}));


// Place bids 
router.post('/listings/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const user = req.user;
    const bidAmount = parseFloat(req.body.bid.amount);
    const newBidAmount = parseFloat(listing.basePrice) + bidAmount;

    if (listing.status === 'auction') {
        // Check if the bid already exists for this user and listing
        const existingBid = await Bid.findOne({ listing: id, user: user._id });

        if (existingBid) {
            // Update the existing bid amount
            existingBid.amount = newBidAmount;
            await existingBid.save();
        } else {
            // Create a new bid
            const newBid = new Bid({
                user: user._id,
                amount: newBidAmount,
                listing: id,
            });
            await newBid.save();
        }

        // Increment the bid count for the listing
        listing.bidCount += 1;

        // Update the base price of the listing
        listing.basePrice = newBidAmount;
        await listing.save();

        req.flash('success', existingBid ? 'Bid updated' : 'New bid added');
        res.redirect(`/auctions/listings/${id}`);
    } else {
        req.flash('error', 'Cannot bid right now');
        res.redirect(`/auctions/listings/${id}`);
    }
}));




// All Bids 
router.get("/bids", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user.id;
    const findBis = await Bid.find().populate("listing");

    let allBids = [];
    for (let bid of findBis) {
        if (bid.user == user) {
            if (bid.listing && bid.listing.status == 'auction') {
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
            if (bid.listing && bid.listing.status == 'finished') {
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

    await Listing.findByIdAndUpdate(id, { status: 'complete' }, { new: true });

    res.redirect(`/auctions/bids/result/${id}`);
}));

//seller details
router.get("/seller/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const user = await User.findById(id).populate({ path: 'reviews', populate: { path: 'author' } });
    res.render("auctions/sellerDetails.ejs", { user });
});

module.exports = router;
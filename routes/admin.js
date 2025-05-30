const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, validateComplain } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfiq.js");
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Complain = require("../models/complain.js");
const WatchList = require("../models/watchList.js");
const Notify = require("../models/notification.js");
const Bid = require("../models/bid.js");
const Auction = require("../models/auction.js");
const Review = require("../models/review.js");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//admin manage listings
router.get("/manageListings", isLoggedIn, wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}).populate('owner');
    res.render("admin/manageListings.ejs", { allListings });
}));

//Create new Listing
router.get("/listings/new", isLoggedIn, (req, res) => {
    res.render("admin/createListing.ejs");
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

    newListing.status = 'Approved';

    // Save the new listing
    await newListing.save();


    req.flash("success", "New Listing Created");
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
    try {
        const { id } = req.params;

        // Update the listing status to 'Approved'
        const listing = await Listing.findByIdAndUpdate(id, { status: 'Approved' }, { runValidators: true, new: true });

        // Create a notification for the listing owner
        const newNotify = new Notify({
            user: listing.owner,
            message: `Congrats! Your listing (${listing.title})  has been accepted`,
            link: `/listings/${id}`
        });
        await newNotify.save();

        // Send email notification
        const user = await User.findById(listing.owner);
        const msg = {
            to: user.email,
            from: 'auctionhm1@gmail.com',
            subject: 'Listing Accepted',
            text: `Congrats! Your listing (${listing.title}) has been accepted. You can view it here: /listings/${id}`,
            html: `<strong>Congrats! Your listing (${listing.title}) has been accepted. You can view it <a href="/listings/${id}">here</a>.</strong>`,
        };

        await sgMail.send(msg);

        req.flash("success", "Listing Accepted");
        res.redirect("/admin/manageListings");
    } catch (err) {
        req.flash("error", "Failed to accept listing");
        res.redirect("/admin/manageListings");
    }
}));

// Reject Listing
router.post("/listings/:id/reject", isLoggedIn, wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;

        // Update the listing status to 'Disapproved'
        const listing = await Listing.findByIdAndUpdate(id, { status: 'Disapproved' }, { runValidators: true, new: true });

        // Create a notification for the listing owner
        const newNotify = new Notify({
            user: listing.owner,
            message: `Your listing (${listing.title}) has been rejected!! Please try again`,
            link: `/listings/${id}`
        });
        await newNotify.save();

        // Send email notification 
        const user = await User.findById(listing.owner);
        const msg = {
            to: user.email,
            from: 'auctionhm1@gmail.com',
            subject: 'Listing Rejected',
            text: `We're sorry, your listing (${listing.title}) has been rejected. Please try again.`,
            html: `<strong>We're sorry, your listing (${listing.title}) has been rejected. Please try again.</strong>`,
        };
        await sgMail.send(msg);

        req.flash("success", "Listing Rejected");
        res.redirect("/admin/manageListings");
    } catch (err) {
        req.flash("error", "Failed to accept listing");
        res.redirect("/admin/manageListings");
    }
}));

// Delete listing
router.delete("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/admin/manageListings");
}));

// Admin manage users
router.get("/manageUsers", isLoggedIn, wrapAsync(async (req, res) => {
    const allUsers = await User.find({});
    res.render("admin/manageUsers.ejs", { allUsers });
}));

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

    req.flash("success", "User Deleted");
    res.redirect("/admin/manageUsers");
}));


//admin manage auctions
router.get("/manageAuctions", isLoggedIn, wrapAsync(async (req, res) => {
    const allAuctions = await Auction.find({});
    res.render("admin/manageAuctions.ejs", { allAuctions });
}));

//Admin Auction form
router.get("/auctions/new", isLoggedIn, wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}).populate('owner');
    let listings = [];
    for (let listing of allListings) {
        if (listing.status === 'Approved') {
            listings.push(listing);
        }
    }
    res.render("admin/createAuction.ejs", { listings });
}));

// Admin submit Auction form
router.post("/manageAuctions", isLoggedIn, wrapAsync(async (req, res) => {
    const { startDate, endDate, auctionList } = req.body.auction;

    const newAuction = new Auction(req.body.auction);

    // Check if the start date and time matches the current date and time
    const currentTime = new Date();
    const auctionStartTime = new Date(startDate);

    if (auctionStartTime <= currentTime) {
        req.flash("error", "Auction start date and time cannot be in the past or the same as the current time.");
        return res.redirect("/admin/auctions/new"); // Redirect to the form page
    }

    for (let id of auctionList) {
        let listing = await Listing.findById(id);
        let price = listing.price;
        await Listing.findByIdAndUpdate(id, { basePrice: price, date: endDate, status: 'auction' }, { runValidators: true, new: true });

        // Create a notification for the user
        const newNotify = new Notify({
            user: listing.owner,
            message: `Your listing (${listing.title}) has been added to an auction.`,
            link: `/auctions/listings/${listing._id}`
        });
        await newNotify.save();
    }

    await newAuction.save();
    res.redirect("/admin/manageAuctions");
}));

//admin auction details
router.get("/auctions/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const auction = await Auction.findById(id).populate("auctionList");
    const allBids = await Bid.find({ listing: { $in: auction.auctionList } }).populate("listing").populate("user");

    // Check existence
    if (!auction) {
        req.flash("error", "The auction you requested does not exist");
        return res.redirect("/admin/manageAuctions");
    }

    let winnersMap = new Map();
    let notifiedUsers = new Set();
    let winnersDetails = new Map();

    // After finished or complete
    if (auction.status === 'finished' || auction.status === 'complete') {
        for (let listing of auction.auctionList) {
            let bidsForListing = allBids.filter(bid => bid.listing && bid.listing._id.equals(listing._id));
            if (bidsForListing.length > 0) {
                let winningBid = bidsForListing.sort((a, b) => b.amount - a.amount)[0];
                if (winningBid && winningBid.user && winningBid.user._id) {
                    winnersMap.set(listing._id, winningBid.user._id);

                    // Fetch user details and store in winnersDetails map
                    let winnerDetails = await User.findById(winningBid.user._id);
                    winnersDetails.set(listing._id, winnerDetails);

                    if (auction.status === 'finished') {
                        // Send notification to the winner
                        const winNotification = new Notify({
                            user: winningBid.user._id,
                            message: `Congratulations! You have won the bid for ${winningBid.listing.title}.`,
                            link: `/auctions/bids/result/${listing._id}`
                        });
                        await winNotification.save();
                        notifiedUsers.add(winningBid.user._id);
                    }
                }
            }
        }

        if (auction.status === 'finished') {
            // Notify the losers
            for (let bid of allBids) {
                if (bid.user && bid.user._id && (!winnersMap.has(bid.listing._id) || !winnersMap.get(bid.listing._id).equals(bid.user._id))) {
                    if (!notifiedUsers.has(bid.user._id)) {
                        const loseNotification = new Notify({
                            user: bid.user._id,
                            message: `Unfortunately, you did not win the bid for ${bid.listing.title}.`,
                            link: `/listings/${bid.listing._id}`
                        });
                        await loseNotification.save();
                        notifiedUsers.add(bid.user._id);
                    }
                }
            }

            await Auction.findByIdAndUpdate(id, { status: 'complete' }, { new: true });
        }
    }

    res.render("admin/auctionDetails.ejs", { auction, winnersMap, winnersDetails });
}));


// Delete auction
router.delete("/auctions/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let auction = await Auction.findById(id);
    if (!auction) {
        req.flash("error", "Auction not found");
        return res.redirect("/admin/manageAuctions");
    }

    // Update listings
    for (let listingId of auction.auctionList) {
        await Listing.findByIdAndUpdate(listingId, { $set: { basePrice: 0, bidCount: 0, status: 'Approved' } }, { runValidators: true, new: true });
    }

    // Find all bids 
    let allBids = await Bid.find().populate("listing");
    for (let bid of allBids) {
        if (bid.listing && bid.listing.status === 'Approved') {
            await Bid.findByIdAndDelete(bid.id);
        }
    }

    // Delete the auction
    await Auction.findByIdAndDelete(id);

    req.flash("success", "Auction Deleted");
    res.redirect("/admin/manageAuctions");
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

    await Complain.findByIdAndUpdate(id, { adminSend: msg, status: 'In Progress' }, { runValidators: true, new: true });

    // Find the complain to get the owner
    const complain = await Complain.findById(id).populate('owner');
    if (complain) {
        // Create a notification for the complain owner
        const newNotify = new Notify({
            user: complain.owner._id,
            message: "Your complaint has a new update.",
            link: `/complaint/${id}`
        });
        await newNotify.save();
    }

    req.flash("success", "Reply Sent");
    res.redirect(`/admin/supportCustomer/${id}`);

}));

//complete support
router.post("/supportCustomer/:id/complete", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const complain = await Complain.findById(id).populate('owner');

    await Complain.findByIdAndUpdate(id, { status: 'complete' }, { runValidators: true, new: true });

    if (complain) {
        // Create a notification for the complain owner
        const newNotify = new Notify({
            user: complain.owner._id,
            message: "Your complaint has been resolved.",
            link: `/complaint/${id}`
        });
        await newNotify.save();

        // Send email notification 
        const msg = {
            to: complain.owner.email,
            from: 'auctionhm1@gmail.com',
            subject: 'Issue Resolved',
            text: 'Your complaint has been resolved.',
            html: '<strong>Your complaint has been resolved.</strong>',
        };
        await sgMail.send(msg);
    }

    req.flash("success", "Issue Resolved");
    res.redirect(`/admin/supportCustomer/${id}`);

}));

// Profile setting
router.get("/profile", isLoggedIn, wrapAsync(async (req, res) => {
    let user = req.user;
    res.render("admin/profile.ejs", { user });
}));

//Change Phone Number
router.post('/changePhoneNumber', isLoggedIn, wrapAsync(async (req, res) => {
    const newNumber = req.body.newNumber;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { phoneNumber: newNumber }, { new: true });
    res.redirect('/admin/profile');
}));

// Change the password
router.post('/password', isLoggedIn, wrapAsync(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        req.flash("error", "New passwords do not match");
        return res.redirect('/admin/profile');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect('/admin/profile');
    }

    user.authenticate(currentPassword, async (err, authenticatedUser, passwordErr) => {
        if (err || passwordErr || !authenticatedUser) {
            req.flash("error", "Current password is incorrect");
            return res.redirect('/admin/profile');
        }

        // Set the new password
        authenticatedUser.setPassword(newPassword, async (err) => {
            if (err) {
                req.flash("error", "Error setting new password");
                return res.redirect('/admin/profile');
            }

            // Save the user with the new password
            await authenticatedUser.save();
            req.flash("success", "Password changed successfully");
            res.redirect('/admin/profile');
        });
    });
}));


module.exports = router;
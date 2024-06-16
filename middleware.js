const Listing = require("./models/listing");
const Notify = require("./models/notification.js");
const Bid = require("./models/bid.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, complainSchema, reviewSchema } = require("./schema.js");

// listing validation middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// complain validation middleware
module.exports.validateComplain = (req, res, next) => {
    let { error } = complainSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// review validation middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// check user log in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //save redirect Url from the session
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login");
        return res.redirect("/login");
    }
    next();
};

// save redirect url in locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// check owner for listing
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to check if user has a winning bid for the listing
module.exports.ensureWinningBid = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user.id;

    const listing = await Listing.findById(id).populate('owner').populate({ path: 'review', populate: { path: 'author' } });
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const winningBid = await Bid.findOne({ listing: id, user: user, amount: listing.basePrice });
    if (!winningBid) {
        req.flash("error", "You did not win this listing");
        return res.redirect(`/listings/${id}`);
    }

    req.listing = listing;
    next();
};

// notifications
module.exports.fetchUserNotifications = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const userNotifications = await Notify.find({ user: req.user._id }).sort({ createdAt: -1 });
            res.locals.userNotifications = userNotifications;
        } else {
            res.locals.userNotifications = [];
        }
        next();
    } catch (err) {
        next(err);
    }
};
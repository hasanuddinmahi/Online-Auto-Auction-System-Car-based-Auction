const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

// listing validation middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// check user log in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //save redirect Url from the session
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login");
        return res.redirect("/login");
    }
    next();
}

// save redirect url in locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// check owner for listing
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    image:[
        {
            url: String,
            filename: String,
        },
    ],
    condition: {
        type: String,
        required: true,
    },
    carType: {
        type: String,
        required: true,
    },
    registrationType: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: String,
        required: true,
    },
    brandModel: {
        type: String,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    seat: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: "pending",
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
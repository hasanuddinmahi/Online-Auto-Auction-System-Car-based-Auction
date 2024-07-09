const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    image: [
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
    registrationNumber: {
        type: String,
        required: true,
    },
    brandModel: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    mileage: {
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
        houseOrRoadName: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        default: "pending",
    },
    basePrice: {
        type: Number,
        default: 0,
    },
    bidCount: {
        type: Number,
        default: 0,
     },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
        }
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: "Review",
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
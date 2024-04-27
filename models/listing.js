const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1707147231430-7870dda96138?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1707147231430-7870dda96138?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
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
    description: String,
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
    status:{
        type: String,
        default: "pending",
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
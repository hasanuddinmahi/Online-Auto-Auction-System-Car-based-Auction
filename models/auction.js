const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        require: true,
    },
    endDate: {
        type: Date,
        require: true,
    },
    auctionList: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
    status: {
        type: String,
        default: "pending",
    }
});

module.exports = mongoose.model("Auction", auctionSchema);
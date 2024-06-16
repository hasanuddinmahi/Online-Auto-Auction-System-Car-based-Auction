const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
    }
});

module.exports = mongoose.model("WatchList", watchSchema);
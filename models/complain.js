const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complainSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    adminSend: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Complain", complainSchema);

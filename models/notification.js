const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notifySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    link: {
        type: String
    }
});

module.exports = mongoose.model("Notification", notifySchema);
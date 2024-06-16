const { types, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    otp: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
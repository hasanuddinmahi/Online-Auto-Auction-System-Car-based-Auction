const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   amount: {
      type: Number,
   },
   listing:
   {
      type: Schema.Types.ObjectId,
      ref: "Listing",
   },
   
});

module.exports = mongoose.model("Bid", bidSchema);
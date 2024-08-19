const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  model: { type: String, required: true},
  description: { type: String, required: true},
  imagePath: { type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
});

module.exports = mongoose.model('Car', carSchema);
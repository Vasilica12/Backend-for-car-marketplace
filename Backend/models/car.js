const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  brand: { type: String, required: true},
  model: { type: String, required: true},
  description: { type: String, required: true}
});

module.exports = mongoose.model('Car', carSchema);
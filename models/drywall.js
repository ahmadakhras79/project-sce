const mongoose = require("mongoose");

const DrywallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quality: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false }, // Optional field for image URL
  rating:{type: Number, default: 0, required: false }
});

module.exports = mongoose.model("Drywall", DrywallSchema);

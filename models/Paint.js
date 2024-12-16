const mongoose = require('mongoose');

const paintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quality: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL or path to the image
  rating:{type: Number, default: 0, required: false }
});

module.exports = mongoose.model('Paint', paintSchema);
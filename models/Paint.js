const mongoose = require('mongoose');

const paintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quality: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL or path to the image
});

module.exports = mongoose.model('Paint', paintSchema);
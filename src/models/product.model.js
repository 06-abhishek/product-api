const mongoose = require("mongoose");

const CATEGORY_ENUM = ["Apparel", "Electronics", "Books", "Home", "Toys"];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: CATEGORY_ENUM,
    required: true,
    index: true,
  },
});

productSchema.statics.validCategories = CATEGORY_ENUM;

module.exports = mongoose.model("Product", productSchema);

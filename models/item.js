// Require Mongoose
const mongoose = require('mongoose');
const Category = require('../models/category');

// Define a schema
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
  cost: { type: Number, required: true },
  description: { type: String, required: true },
  inventory: { type: Number, required: true },
});

ItemSchema.virtual('url').get(function () {
  return `/catalog/item/${this.id}`;
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model('Item', ItemSchema);

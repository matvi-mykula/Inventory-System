// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  //   numOfUniqueItems: { type: Number, required: true },
});

CategorySchema.virtual('url').get(function () {
  return `/catalog/category/${this._id}`;
});

CategorySchema.statics.getCats = function () {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve(docs);
    });
  });
};

// Export function to create "SomeModel" model class
module.exports = mongoose.model('Categories', CategorySchema);

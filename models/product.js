var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  _id: String,
  name: String,
  link: String,
  code: String,
  price: String,
  savedPrice: String,
  country: String,
  producer: String,
  airMiles: String,
  volume: String,
  image: String,
  alcohol: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
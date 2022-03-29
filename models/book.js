const mongoose = require('mongoose');

const Schema = new mongoose.Schema();

const BookSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true, max: 100 },
  genre: [{ type: String, required: true, max: 100 }],
});

// Virtual for book's URL
BookSchema.virtual('url').get(() => {
  return '/catalog/book/' + this._id;
});

// Export model
module.exports = mongoose.model('Book', BookSchema);

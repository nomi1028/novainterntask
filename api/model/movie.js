const mongoose = require("mongoose");
//////////////create schema
//////defining datatype
const movieSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  genre: String,
  actor: String,
  bussinessdone: String,
  rating: Number,
  reviews: String,
});
/////////////create  Actor model(collection)& here Actor is collection and movieSchema is a schema
module.exports = mongoose.model("Movie", movieSchema);
// name, genre, actors, business done, rating, reviews

const mongoose = require("mongoose");
//////////////create schema
//////defining datatype
const actorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  age: Number,
  gender: String,
  imagepath:String,
});
/////////////create  Actor model(collection)& here Actor is collection and actorschema is a schema
module.exports = mongoose.model("Actor", actorSchema);

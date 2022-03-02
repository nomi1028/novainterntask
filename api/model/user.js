const mongoose = require("mongoose");
//////////////create schema
//////defining datatype
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  pasword: String,
  phnnbr: Number,
  usertype: String,
});
/////////////create  Actor model(collection)& here Actor is collection and actorschema is a schema
module.exports = mongoose.model("User", userSchema);

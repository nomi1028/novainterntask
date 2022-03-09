const express = require("express");
const app = express();
const actor = require("./api/routes/actor");
const movie = require("./api/routes/movie");
const user = require("./api/routes/user");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload=require("express-fileupload");
// const converter = require('json-2-csv');
////////creating connection between node and mongo
mongoose.connect(
  "mongodb+srv://NoumanAzeem:12345@db.e6le9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

mongoose.connection.on("error", (err) => {
  console.log("not connected");
});
mongoose.connection.on("connected", (connected) => {
  console.log("yes connected");
});
app.use(fileUpload({
  useTempFiles:true
}))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
/////////here actor and movie are routes
app.use("/actor", actor);
app.use("/user", user);
app.use("/movie", movie);
app.use((req, res, next) => {
  res.status(404).json({
    message: "bad Request",
  });
});

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "hey NOumann",
//   });
// });
module.exports = app;

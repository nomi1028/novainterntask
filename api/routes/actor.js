const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const Actor = require("../model/actor");
const checkAuth = require("../middleware/checkauth");
///////////////////////////
//List all the actors
//&checkAuth here is working as a authentication
//////////////////////////
routes.get("/", checkAuth, (req, res, next) => {
  Actor.find()
    .then((result) => {
      res.status(200).json({
        actorData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
///////////////////////////////
//List a specific actor
//////////////////////////////
routes.get("/:id", checkAuth, (req, res, next) => {
  Actor.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        actorData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
/////////////////////////////////////////
//Create actors
////////////////////////////////////////
routes.post("/", (req, res, next) => {
  const actor = new Actor({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
  });
  actor
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newActor: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
/////Updating specific Actor/////////

routes.put("/:id", (req, res, next) => {
  Actor.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.status(200).json({
        updatedData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});


module.exports = routes;

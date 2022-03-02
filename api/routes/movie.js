const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const Movie = require("../model/movie");
const checkAuth = require("../middleware/checkauth");
routes.get("/", checkAuth, (req, res, next) => {
  Movie.find()
    .then((result) => {
      res.status(200).json({
        movieData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
///////
routes.get("/:id", checkAuth, (req, res, next) => {
  Movie.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        MovieData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
///////////////

routes.post("/", checkAuth, (req, res, next) => {
  const movie = new Movie({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    genre: req.body.genre,
    actor: req.body.actor,
    bussinessdone: req.body.bussinessdone,
    rating: req.body.rating,
    reviews: req.body.reviews,
  });
  movie
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newMovie: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
routes.put("/:id", checkAuth, (req, res, next) => {
  Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        genre: req.body.genre,
        actor: req.body.actor,
        bussinessdone: req.body.bussinessdone,
        rating: req.body.rating,
        reviews: req.body.reviews,
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
routes.delete("/:id", checkAuth, (req, res, next) => {
  Movie.remove({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "Deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = routes;

const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const Movie = require("../model/movie");
const checkAuth = require("../middleware/checkauth");
const converter = require('json-2-csv');
var fs = require('fs');

var cloudinary=require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'dqdpio4xn', 
  api_key: '467147114767511', 
  api_secret: 'o_sJvKKf2sDscXqQYVg1Ar0pwZA' 
});
////////list by genre
routes.get("/", (req, res, next) => {
  const arr = [{ dashing: [], sad: [], comedy: [] }];
  Movie.find()
    .then((result) => {
      result.map((res) => {
        if (arr.length == "dashing") {
          return arr[0].dashing.push(res);
        } else if (res.genre == "sad") {
          return arr[0].sad.push(res);
        } else if (res.genre == "comedy") {
          return arr[0].comedy.push(res);
        }
        return;
      });
      res.status(200).json(arr);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
routes.get("/data", (req, res, next) => {
  Movie.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
routes.get("/csv", (req, res, next) => {
  Movie.find()
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
      let json2csvCallback = function (err, csv) {
        if (err) throw err;
        fs.writeFile('name.csv', csv, 'utf8', function(err) {
          if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
          } else {
            console.log('It\'s saved!');
          }
        });
    };
    
    converter.json2csv(result, json2csvCallback, {
      prependHeader: false      // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    });
   
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
//////bussiness of specific actor
routes.get("/:nomi", checkAuth, (req, res, next) => {
  var amount = 0;
  Movie.find({ actor: req.params.nomi })
    .then((result) => {
      result.map((res) => {
        // amount = amount + res.bussinessdone;
        amount = amount + res.bussinessdone;


        return;
      });
      // const avrg=amount/Movie.length;
      // console.log(avrg);
      console.log(amount);
      res.status(200).json(amount);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

/////specific movie
routes.get("/:id/a", checkAuth, (req, res, next) => {
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

routes.post("/",  (req, res, next) => {
  const file=req.files.poster;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    const movie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      genre: req.body.genre,
      actor: req.body.actor,
      bussinessdone: req.body.bussinessdone,
      rating: req.body.rating,
      reviews: req.body.reviews,
      posterpath:result.url,
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

  })
 
});
routes.put("/:id",  (req, res, next) => {
  const file=req.files.poster;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);

  

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
        posterpath:result.url,
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
  })
});

module.exports = routes;

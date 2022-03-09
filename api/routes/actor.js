const express = require("express");
var app = express();
const routes = express.Router();
const mongoose = require("mongoose");
const Actor = require("../model/actor");
const axios = require("axios");
const checkAuth = require("../middleware/checkauth");
var upload = require("../middleware/multer");

var fs = require("fs");
var https = require("https");
var path = require("path");

var { fileURLToPath } = require("url");
const actor = require("../model/actor");

// const __filename = fileURLToPath();
// const _dirname = path.dirname(__filename);

var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dqdpio4xn",
  api_key: "467147114767511",
  api_secret: "o_sJvKKf2sDscXqQYVg1Ar0pwZA",
});

const downloadImage = (_url, filename) => {
  const _path = `./${filename}`;

  const localpath = fs.createWriteStream(_path);
  https.get(_url, (res) => {
    res.pipe(localpath);
  });
};
const allActorsFromApi = (all_Actors) => {
  const All_ActorsData = [];
  for (let i in all_Actors) {
    const image_name = path.basename(all_Actors[i].picture);
    downloadImage(all_Actors[i].picture, image_name);
    if (
      all_Actors[i].title == "ms" ||
      all_Actors[i].title == "mrs" ||
      all_Actors[i].title == "miss"
    ) {
      All_ActorsData.push({
        name: all_Actors[i].firstName.concat(" ", all_Actors[i].lastName),
        gender: "female",
        imagepath: `${process.env.CLIENT_URL}/imagepath/${image_name}`,
        age: "",
      });
    }
    if (all_Actors[i].title == "mr") {
      All_ActorsData.push({
        name: all_Actors[i].firstName.concat(" ", all_Actors[i].lastName),
        gender: "male",
        imagepath: `${process.env.CLIENT_URL}/imagepath/${image_name}`,
        age: "",
      });
    } else {
      All_ActorsData.push({
        name: all_Actors[i].firstName.concat(" ", all_Actors[i].lastName),
        gender: "other",
        imagepath: `${process.env.CLIENT_URL}/imagepath/${image_name}`,
        age: "",
      });
    }
  }
  return All_ActorsData.slice(0, 50);
};
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
  const file = req.files.photos;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log(result);
    const actor = new Actor({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      imagepath: result.url,
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
});
/////Updating specific Actor/////////

routes.put("/:id", (req, res, next) => {
  const file = req.files.photos;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log(result);

    Actor.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          gender: req.body.gender,
          imagepath: result.url,
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
});
routes.get("/getDataFromDummyApi/a", async (req, res) => {
  try {
    const col_1 = await axios.get("https://dummyapi.io/data/v1/user", {
      headers: { "app-id": "622729fc8bdc80ac1b9518c0" },
      params: { limit: 50, page: 0 },
    });
    const all_Actors = col_1.data.data;
    const col_2 = await axios.get("https://dummyapi.io/data/v1/user", {
      headers: { "app-id": "622729fc8bdc80ac1b9518c0" },
      params: { limit: 50, page: 1 },
    });
    const all_Actors1 = col_2.data.data;
    const actors_data = allActorsFromApi(all_Actors);
    const actor_data1 = allActorsFromApi(all_Actors1);

    try {
      actor.insertMany(actors_data, (error, docs) => {
        if (error) {
          res.json({
            message: error,
          });
        } else {
          res.json({ message: "All actors are addedd" });
        }
      });
    } catch (error) {
      res.json({
        message: "error",
      });
    }
    try {
      actor.insertMany(actor_data1, (error, docs) => {
        if (error) {
          res.json({
            message: error,
          });
        } else {
          res.json({ message: "All actors are added" });
        }
      });
    } catch (error) {
      res.json({
        message: "error",
      });
    }
  } catch (error) {
    res.json({
      message: "err",
    });
  }
});

module.exports = routes;

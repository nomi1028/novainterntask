const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");
const bcrpt = require("bcrypt");
const user = require("../model/user");
const jwt = require("jsonwebtoken");

routes.post("/signup", (req, res, next) => {
  bcrpt.hash(req.body.pasword, 10, (err, hash) => {
    // Store hash in your password DB.
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        pasword: hash,

        phnnbr: req.body.phnnbr,
        usertype: req.body.usertype,
      });
      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            newUser: result,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});
routes.post("/login", (req, res, next) => {
  user
    .find({ name: req.body.name })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "user Not exist",
        });
      } else {
        bcrpt.compare(req.body.pasword, user[0].pasword, (err, result) => {
          if (!result) {
            res.status(401).json({
              message: "pasword not match",
            });
          }
          ///here token is generte when name,pasword match from data,
          if (result) {
            const token = jwt.sign(
              {
                name: user[0].name,
                usertype: user[0].usertype,
                email: user[0].email,
                phnnbr: user[0].phnnbr,
              },
              "this is dummy text",
              {
                expiresIn: "24h",
              }
            );
            res.status(200).json({
              name: user[0].name,
              usertype: user[0].usertype,
              email: user[0].email,
              phnnbr: user[0].phnnbr,
              token: token,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = routes;

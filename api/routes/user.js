const express = require("express");
const routes = express.Router();
const loadash=require("lodash");
const mongoose = require("mongoose");
const User = require("../model/user");
const bcrpt = require("bcrypt");
// const user = require("../model/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv/config");
const GenerateEmailActivateToken = require("../middleware/generte");
const transporter = require("../middleware/sendmail");

// import nodemailer from 'nodemailer';
// import 'dotenv/config';

routes.post("/signup", async (req, res, next) => {
  const UserData = req.body;
  const url = process.env.CLIENT_URL;
  const isExist = await User.findOne({ email: req.body.email });
  if (isExist) {
    res.json({ message: "Email is already exist" });
  } else {
    const token = GenerateEmailActivateToken({ email: req.body.email });
    let mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Activation Link",
      text: `
             please click on below link to activate your account \n
            ${url}/user/activate/${token} `,
    };
    const NewUser = User({
      name: UserData.name,
      email: UserData.email,
      phnnbr: UserData.phnnbr,
      pasword: UserData.pasword,
    });
    console.log(token);
    try {
      await NewUser.save();
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          res.json({ message: error.message });
        } else {
          res
            .status(200)
            .json({ message: "Please check your email account and verify it" });
        }
      });
    } catch (error) {
      res.status(406).json({ message: error.message });
    }
  }
});
routes.post("/login", (req, res, next) => {

  User.find({ name: req.body.name })
    .exec()
    .then((user) => {
      if (user.length < 1 && user.verified==false) {
        return res.status(401).json({
          message: "user Not existssssss",
        });
      } else {
        bcrpt.compare(req.body.pasword, user[0].pasword, (err, result) => {
          if (!result) {
            res.status(401).json({
              message: "password does not match",
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
routes.get("/activate/:token", async (req, res) => {
  const token = req.params.token;

  try {
    jwt.verify(token, process.env.EMAIL_ACTIVATE_TOKEN);
    const Newuser = jwt.decode(token, { complete: true });
    const UserData = Newuser.payload;
    try {
      await User.updateOne({ email: UserData.email }, { verified: true });
      res.json({ message: "Verified successfully" });
    } catch (error) {
      res.json({ message: error.message });
    }
  } catch (error) {
    res.json({
      message: "You are not authorized user so you can not registered",
    });
  }
});
routes.put("/forget", (req, res) => {
  const { email } = req.body;
  console.log(email);
  

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "user with this email does not exist",
      });
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.FORGET_ACTIVATE_TOKEN,
      { expiresIn: "20m" }
    );

    let data = {
      from: process.env.EMAIL,
      to: email,
      subject: "Activation Link",
      text: `
            <h2>please click on below link to Reset your Pasword </h2> \n
           ${process.env.CLIENT_URL}/user/resetpasword/${token}`,
    };
    console.log(token)

    return User.updateOne({ resetlink: token }, (err, success) => {
      if (err) {
        res.status(400).json({
          err: err.message,
        });
      } else {
        console.log("done");
        
        transporter.sendMail(data, (error) => {
          if (error) {
            res.json({ message: error.message });
          } else {
            res.status(200).json({ message: "Please check your email" });
          }
        });
      }
    });
  });
});
routes.put("/resetpasword", (req, res) => {
 const {resetlink,newpass}=req.body;
 if(resetlink){
  jwt.verify(resetlink, process.env.FORGET_ACTIVATE_TOKEN,(error,decode)=>{

      if (error) {
       return res.json({ message: "incorrect tokenn" });
      } 
      User.findOne({resetlink},(err,user)=>{
        if (err||!user) {
          return res.json({ message: "user by this token not exist" });
         } 
         const newobj={
           pasword:newpass
         }
         user=loadash.extend(user,newobj);
         user.save((err,result)=>{
          if (err) {
            return res.status(400).json({
              err: err.message,
            });
          } else {
            return res.status(200).json({
              message:"pasword chng"
              
            });
            
            
           
          }

         })


      })
    });

  

 }
 else{
  return res.status(401).json({
    err: "Authentication error",
  });
 }

 
})
module.exports = routes;

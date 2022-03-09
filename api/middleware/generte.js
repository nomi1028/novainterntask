const nodemailer = require("nodemailer");
require("dotenv/config");
const JWT = require("jsonwebtoken");

const GenerateEmailActivateToken = (user) => {
  console.log(user);
  const token = JWT.sign(
    {
      name: user.name,

      email: user.email,
      phnnbr: user.phnnbr,
      pasword: user.pasword,
      usertype: user.usertype,
    },
    process.env.EMAIL_ACTIVATE_TOKEN,
    { expiresIn: "1h" },
    { algorithm: "RS256" }
  );
  console.log(token);
  return token;
};

module.exports = GenerateEmailActivateToken;

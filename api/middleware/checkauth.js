const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const verify = jwt.verify(token, "this is dummy text");
    next();
  } catch (error) {
    return res.status(401).json({
      messgage: "invaild token",
    });
  }
};

/////eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibm91bWFuYXplZW0iLCJ1c2VydHlwZSI6ImFkbWluIiwiZW1haWwiOiJub3VtYW4xQGdtYWlsLmNvbSIsInBobm5iciI6MzQ1NDUzMzMyMiwiaWF0IjoxNjQ2MTIxMzUxLCJleHAiOjE2NDYyMDc3NTF9.7UZynQALiV8jelxlUxXNeieMY02Rgv7SzatUDqcfrDg

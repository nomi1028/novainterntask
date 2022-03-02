const http = require("http");
const app = require("./app");
//creating server
const server = http.createServer(app);
server.listen(3000, console.log("server is ruuning"));

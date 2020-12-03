const express = require("express");
const server = express();
const myPublicFiles = express.static("../public");	
const bodyParser = require("body-parser");
const cors = require("cors");
 const cookieParser = require("cookie-parser");
 const listenPort = 7777;
//const {Server, cookieParser,cors,bodyParser,server,} = require("./express.js");

function Server(string){
    server.use(myPublicFiles);
    server.use(bodyParser.urlencoded({"extended":false}));
    server.use(bodyParser.json());
    server.use(cors());
    server.listen(listenPort, () => {
	console.log(`${string} ${listenPort}`);
    });

}

module.exports = {Server,server}
///////////////////////Start Server/////////////////////

const express = require("express");
const server = express();

const myPublicFiles = express.static("../public");	
const bodyParser = require("body-parser");
const cors = require('cors') ;


require("./config/config")
require("dotenv").config();

 /////////////////////////////////////////////////////Server Conection//////////////////////////////////////////////////

   server.use(myPublicFiles);
   server.use(bodyParser.urlencoded({"extended":true}));
   server.use(bodyParser.json());
   server.use(cors());
   server.use(require("./routes/users"))
   server.use(require("./routes/beerD"))
   server.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
      // Pass to next layer of middleware
      next();
  });
   server.listen(process.env.PORT,(req,res)=>{
    console.log(`listening PORT:` + process.env.PORT)
    })


//////////////////////////Sequelize/////////////////////////////////////77
   //server.use(require("./routes/RegisterUser"))



























    module.exports = server
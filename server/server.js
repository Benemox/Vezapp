///////////////////////Start Server/////////////////////

const express = require("express");
const server = express();

const myPublicFiles = express.static("../public");	
const bodyParser = require("body-parser");
const cors = require("cors");

require("./config/config")
require("dotenv").config();

 /////////////////////////////////////////////////////Server Conection//////////////////////////////////////////////////

   server.use(myPublicFiles);
   server.use(bodyParser.urlencoded({"extended":false}));
   server.use(bodyParser.json());
   server.use(cors());
   server.use(require("./routes/users"))
   server.use(require("./routes/beerD"))
   server.listen(process.env.PORT,(req,res)=>{
    console.log(`listening PORT:` + process.env.PORT)
    })


//////////////////////////Sequelize/////////////////////////////////////77
   //server.use(require("./routes/RegisterUser"))



























    module.exports = server
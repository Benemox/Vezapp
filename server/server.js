
///encrypt to future modules
const base64 = require("base-64");
const crypto = require("crypto");
const fetch = require("node-fetch");
require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const GH_SECRET = process.env.GH_SECRET;

const SECRET_JWT = process.env.SECRET_JWT;

/////////////////////////IMPORT/////////////////////////////////////////////////////////////////////////////////////////

const {Server,server} = require("./lib/express");
const {SQLquery,connection,MongoClient} = require("./lib/DB")
const {encryptPassword,getJWTInfo,verifyJWT,generateJWT} = require("./lib/JWT");


////Server Conecction
Server("se esta escuchando por ")
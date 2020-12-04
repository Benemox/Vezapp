
///////////////////////Start Server/////////////////////
// const express = require("express");
// const server = express();
// const myPublicFiles = express.static("../public");	
// const bodyParser = require("body-parser");
// const cors = require("cors");
//  const cookieParser = require("cookie-parser");
 // const listenPort = 7777;

///encrypt to future modules
const base64 = require("base-64");
const crypto = require("crypto");
const fetch = require("node-fetch");
require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const GH_SECRET = process.env.GH_SECRET;

const SECRET_JWT = process.env.SECRET_JWT;

/////////////////////////IMPORT/////////////////////////////////////////////////////////////////////////////////////////

const SQLquery = require("./lib/DB")
const {encryptPassword,getJWTInfo,verifyJWT,generateJWT} = require("./lib/JWT");
const server = require("./server")
const listenPort = 7777;

/////////////////////////////////////////////////////Server jwt Conection//////////////////////////////////////////////////
server.get("/jwt", (req, res) => {

	const Payload = {

		"userName": "Admin",
		"iat": new Date(),
		"role": "Admin",
		"ip": req.ip
	};
	const JWT = generateJWT(Payload);
	res.cookie("jwt", JWT, {"httpOnly": true});
	res.send("Hola Mundo");
});


////////////////////////////////////////////////////////Querys//////////////////////////////////////////////////////////////



/*                                                USER Querys                                                            */

// PIDE:
// -Rango = let range
// -Favoritos = let favBeer
// /editprofile (button)
// (avatar pendiente)///foto perfil

// (Ultimos logros creo.....)

















/*                                                 Beer Querys                                                                   */

//////////////////////////////////////////////////////GetSpecificBeer//////////////////////////////////////////////////////

/// ya añadiremos mas tarde si es preciso que solo envie ciertos datos especificos por ahora asi esta bien
server.get("/Beer", async (req, res)=>{
	let {idBeer} = req.body;
	SQLquery("SELECT * FROM Beers WHERE idBeer = ?", [idBeer])
		.then(result =>res.send(result));
});


//////////////////////////////////////////////////FeelBeer////////////////////////////////////////////////////////////////////

server.get("/FeelBeer", async (req, resp)=>{
	let {FEEL} = req.body;
	SQLquery("SELECT idfav FROM BeerFeelUser WHERE idFeel = ?", [FEEL])
    .then(
        (result)=>{
            let arr
            SQLquery("SELECT idbeer FROM favuser WHERE idfav = ?", [result[0].idfav])
				// .then(response => JSON.parse(response))
                    .then(data =>{
                        arr = [...data]
						if(arr.length < 10){
							let LIMIT = 10- arr.length
                            SQLquery("SELECT idbeer FROM GenericBeersFeel WHERE idFeel = ? ORDER BY RAND() LIMIT ?", [FEEL,LIMIT])
                                .then(data =>{
									arr = [...arr,...data]
								})
								.catch(err =>{
									console.log(err);
									resp.send(err);
								})
                        }
                        else resp.send(arr)
						}).catch(err =>{
       					 	console.log(err);
        					resp.send(err);
    					});

		})
		.catch(err =>{
			console.log(err);
			resp.send(err);
		});
			
})
/////////////////////////////////////////////////////Search////////////////////////////////////////////////////  

server.get("/Search", async (req, res)=>{
	let {Term} = req.body;
	console.log(Term)
	SQLquery("SELECT * FROM Beers WHERE type = ? OR name = ? OR FerType =? OR vol = ? OR  alc = ? OR country = ? OR color = ?", [Term,Term,Term,Term,Term,Term,Term])
		.then(result =>res.send(result))
		.catch(err => res.send(err))
});





server.listen(listenPort, () => {
	console.log(`el servidor esta en el puerto ${listenPort}`);
    });

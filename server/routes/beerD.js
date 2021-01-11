

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                      //
//                                                            BEERS                                                                   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const express = require('express');
const SQLquery = require("../lib/DB")
const server = express()  
const {oauthJwt} = require("../middlewares/oauth-jwt")



//////////////////////////////////////////////////////favorites beer//////////////////////////////////////////////////////////////
server.get("/favoritesBeer", oauthJwt,async (req, res)=>{
	let iduser = req.user.IDUSER
	SQLquery("SELECT * FROM Beers LEFT JOIN FAVUSER ON cervezas.idbeer = favUser.idBeer WHERE iduser = ?", [iduser])
		.then(result =>res.send(result))
		.catch(err =>{
			console.log(err);
			res.send(err);
		})
});
                                ///////////////////////////////////deleteFAv//////////////////////////////////
server.get("/deletefav", oauthJwt, async (req, res)=>{
	let idUser = req.user.IDUSER
	let idBeer = req.params.idBeer;;
	SQLquery("DELETE FROM FAVUSER WHERE idfav = ? AND iduser ? ", [idBeer,idUser])
		.then(result =>res.send(result));
});

                                 //////////////////////////////////////addFav////////////////////////////////
server.get("/addtomyfavoritesBeers/:idBeer",oauthJwt, async (req, res)=>{
    let iduser = 16
	let idBeer = req.params.idBeer;
		SQLquery("INSERT INTO FAVUSER (IDUSER,IDBEER) VALUES (?, ?)", [iduser,idBeer])
			.then(result => res.send(result))
			.catch(err => res.send(err));
});
server.get("/Beer/:name", async (req, res)=>{
    console.log(req.param)
	 let name = req.params.name;
	await SQLquery("SELECT * FROM cervezas WHERE name = ?", [name])
 	.then(result =>res.send(result));
    res.send("hola")
});


//////////////////////////////////////////////////////ALLBeer//////////////////////////////////////////////////////


server.get("/Beer",  async (req, res)=>{
	SQLquery("SELECT * FROM cervezas ")
		.then(result =>res.send(result));
});


///////////////////////////////////////////////////SCANBEEER////////////////////////////////////////////////77
server.get("/ImgoingTohaveLuck/:ean", async (req, res)=>{

    console.log(req.params.ean)
	 let ean = req.params.ean;
	await SQLquery("SELECT * FROM cervezas WHERE EAN = ?", [ean])
 	.then(result =>res.send(result));
});

module.exports = server;
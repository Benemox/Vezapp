
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


///////////////////////////////////////////////////////Profile///////////////////////////////////////////////////////////////////7777
	 server.post("/register",async (req,res)=>{
		const data = req.body
		console.log(data)
		// const Payload = {

		// 	"userName": data.user,
		// 	"iat": new Date(),
		// 	"role": data.user,
		// 	"ip": req.ip
		// };
		// const JWT = await generateJWT(Payload);
		// res.cookie("jwt", JWT, {"httpOnly": true});
		res.send({"gracias": "ha sido guardado"})
		res.redirect("http://localhost:3000/dasboard")
		

	 })




///////////////////////////////////////////////////Edit Profile////////////////////////////


server.get("/editProfile", async (req, res)=>{
	//let {term} = req.body;
	let data = [req.body]
	console.log(data)
	data.map(el=>Object.values(el).map(e=>{console.log(Object.keys(e)[0])
		SQLquery(`UPDATE user SET ${Object.keys(e)[0]} = ? WHERE ${Object.keys(e)[1]}= ?`, [Object.values(e)[0],Object.values(e)[1]])
			.then(result =>res.send(result))
			.catch(err =>{
				console.log(err);
				res.send(err);
			})
	}))
})


//////////////////////////////////////////////////////favorites beer//////////////////////////////////////////////////////////////
server.get("/favoritesBeer", async (req, res)=>{
	let {iduser} = req.query;
	SQLquery("SELECT * FROM Beers LEFT JOIN favUser ON beers.idbeer = favUser.idBeer WHERE iduser = ?", [iduser])
		.then(result =>res.send(result))
		.catch(err =>{
			console.log(err);
			res.send(err);
		})
});
                                ///////////////////////////////////deleteFAv//////////////////////////////////
server.get("/deletefav", async (req, res)=>{
	let {idfav} = req.query;
	SQLquery("DELETE FROM favuser WHERE idfav = ? ", [idfav])
		.then(result =>res.send(result));
});

                                 //////////////////////////////////////addFav////////////////////////////////
server.get("/addfav", async (req, res)=>{
	let {idBeer,iduser} = req.query;
		SQLquery("INSERT INTO favuser (iduser,idBeer) VALUES (?, ?)", [idBeer,iduser])
			.then(result => res.send(result))
			.catch(err => res.send(err));
});










/*                                                 Beer Querys                                                                   */

//////////////////////////////////////////////////////GetSpecificBeer//////////////////////////////////////////////////////

/// ya añadiremos mas tarde si es preciso que solo envie ciertos datos especificos por ahora asi esta bien
server.get("/Beer", async (req, res)=>{
	let {idBeer} = req.query;
	SQLquery("SELECT * FROM Beers WHERE idBeer = ?", [idBeer])
		.then(result =>res.send(result));
});


//////////////////////////////////////////////////FeelBeer////////////////////////////////////////////////////////////////////

server.get("/FeelBeer", async (req, resp)=>{
	let {FEEL} = req.query;
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
	let {Term} = req.query;
	console.log(Term)
	SQLquery("SELECT * FROM Beers WHERE type = ? OR name = ? OR FerType =? OR vol = ? OR  alc = ? OR country = ? OR color = ?", [Term,Term,Term,Term,Term,Term,Term])
		.then(result =>res.send(result))
		.catch(err => res.send(err))
});





server.listen(listenPort, () => {
	console.log(`el servidor esta en el puerto ${listenPort}`);
    });

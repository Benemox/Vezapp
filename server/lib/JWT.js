
///encrypt to future modules
const base64 = require("base-64");
const crypto = require("crypto");

require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const GH_SECRET = process.env.GH_SECRET;

const SECRET_JWT = process.env.SECRET_JWT;
const SALT  = process.env.SALT 


//COMPROBACIÓN DEL JWT
function parsejwt(token){
	let base64url =token.split('.')[1];
	let base64 = base64url.replace('-','+').replace('_','/');
	return JSON.parse(window.atob(base64))

}

//FUNCIONES PARA CODIFICACION JWT  =====>> TODO ESTO VA EN FRONTEND

function encodeBase64(string) {
	const encodedString = base64.encode(string);
	const parsedString = encodedString
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
	return parsedString;
}

function decodeBase64(base64String) {
	const decodedString = base64.decoded(base64String);
	return decodedString;
}

function generateJWT(Payload) {
	const header = {
		"alg": "HS256",
		"typ": "JWT"
	};
	const base64Payload = encodeBase64(JSON.stringify(Payload));
	const base64Header = encodeBase64(JSON.stringify(header));
	const signature = encodeBase64(hash(`${base64Header}.${base64Payload}`));
	const JWT = `${base64Header}.${base64Payload}.${signature}`;
	return JWT;
}

function hash(string) {
	const hashedString = crypto
		.createHmac("sha256", SECRET_JWT)
		.update(string)
		.digest("base64");
	return hashedString;
}

function verifyJWT(jwt) {
	const [header, payload, signature] = jwt.split(".");
	if (header && payload && signature) {
		const expectedSignature = encodeBase64(hash(`${header}.${payload}`));
		if (expectedSignature === signature) {
			return true;
		}
	}
	return false;
}

function getJWTInfo(jwt) {
	const [payload] = jwt.split(".")[1];
	if (payload) {
		try {
			const data = JSON.parse(decodeBase64(payload));
			return data;
		} catch (e) {
			return null;
		}
	}
	return null;
}
// FUNCIONES DE ENCRIPTACION DE CONTRASEÑA

function encryptPassword(string) {
	let saltedPassword = SALT  + string + SALT
	return saltedPassword
}

module.exports = encryptPassword,getJWTInfo,verifyJWT,generateJWT
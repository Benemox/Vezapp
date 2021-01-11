
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                      //
//                                                              USER                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const express = require('express');
const SQLquery = require("../lib/DB")
const server = express()
const bcrypt = require("bcrypt");
const secret = process.env.SECRET_JWT
const EXPIRE_TOKEN = process.env.EXPIRE_TOKEN
const jwt = require("jsonwebtoken");    
const {oauthJwt} = require("../middlewares/oauth-jwt")





    



//////////////////////////////////////////////////////////////////////////////////
//                           USER ADMIN                                         //
//////////////////////////////////////////////////////////////////////////////////
server.post("/login",async (req,res)=>{
    let body = req.body
    let duplicate = await SQLquery(`SELECT * FROM USERs WHERE email = ?`,[body.email])
    let emaildb = (!duplicate[0]) ? "nulo" : duplicate[0].email
    let token = req.get("token")
    
    jwt.verify(token,secret, (err,decoded)=>{
                if(err){
                    if(emaildb !== body.email){
                        return res.status(400).json({ message:"Usuario o contraseña incorrectos"})}
                        else{
                            let pwdDB = duplicate[0].pwd
                            if(!bcrypt.compareSync(body.pwd,pwdDB)){
                                    return res.status(400).json({ message:"Usuario o contraseña incorrectos"})
                            }
                            let token = jwt.sign({user:duplicate[0]},secret,{ expiresIn: EXPIRE_TOKEN} );
                            jwt.verify(token,secret, (err,decoded)=>{
                                if(err){
                                    return res.status(401).json({ok:false,message: "Token no valido"})
                                }
                        
                                return duplicate = {
                                    IDUSER: decoded.user.IDUSER,
                                    email: decoded.user.email,
                                    name: decoded.user.name
                                }
                            })
                            return res.json({
                                ok:true,
                                usuario: duplicate,
                                token
                            })
                }
            }
            return res.json({
                ok:true,
                usuario:{
                    IDUSER: decoded.user.IDUSER,
                    email: decoded.user.email,
                    name: decoded.user.name
                } ,
                token
            })
        }
    )

});








server.post("/User",oauthJwt,async (req,res)=>{
        res.send(req.user)
    })
 //////////////////////////////////////////////////////////////////////////////////
//                           REGISTER PROFILE                                    //
//////////////////////////////////////////////////////////////////////////////////   
server.post("/regUser",async (req,res)=>{
    let body = req.body
    let duplicate = await SQLquery(`SELECT * FROM USERs WHERE email = ?`,[req.body.email])  
    
    if(duplicate.length< 0){
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(body.pwd, salt,async function(err, hash) {
           if(hash){
            await SQLquery('INSERT INTO USERs (email, pwd, name)VALUES (?, ?,?)',[body.email,hash, body.name])
            let token = jwt.sign({user:duplicate[0]},secret,{ expiresIn: EXPIRE_TOKEN} )
            return res.json({
                ok:true,
                usuario:{
                    IDUSER:await SQLquery(`SELECT IDUSER FROM USERs WHERE email = ?`,[body.email])[0] ,
                    email: body.email,
                    name: body.name
                } ,
                token
            })
           }else{
               console.log(body.pwd)
             return  res.json(err +"   no Salteado")
           }
        })
    });
     }
     res.json({
        ok:false,
        message: "El email ya se encuentra dentro de nuestra base de datos"
     })
})






//////////////////////////////////////////////////////////////////////////////////
//                           EDIT PROFILE                                       //
//////////////////////////////////////////////////////////////////////////////////
server.put("/editProfile/:meth",oauthJwt, async (req, res)=>{
    let body = req.body
    let iduser = req.user.IDUSER//////////////////////////////////CAMBIAR SI NO CONSEGUIMOS LO DE LAS COOKIES
    let meth = req.params.meth
    console.log(iduser)
    console.log(meth)
    //!body.email || !body.pwd || !req.user ? res.status(400).json({ message:"el campo esta vacios"}) : console.log("status: ok");
    if(meth === "Setpwd" ){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(body.pwd, salt,async function(err, hash) {
               if(hash){
                await SQLquery('UPDATE USERs SET pwd = ? WHERE IDUSER = ?;',[hash,iduser])
               return res.json({
                    ok:true,
                    usuario: req.user,
                    //token
                    message: "contraseña actualizada"
                })
               }else{
                   console.log(body.pwd)
                   return res.json(err)
               }
            })
        })
    }if(meth === "Setmail"){
       await SQLquery('UPDATE USERs SET email = ? WHERE IDUSER = ?;',[body.email,iduser])
       return res.json({
        ok:true,
        usuario: req.user,
        message: "nombre mail cambiado"
        //token
    })
    }
    if(meth === "Setname"){
        await SQLquery('UPDATE USERs SET name = ? WHERE IDUSER = ?;',[body.name,iduser])
        return res.json({
         ok:true,
         usuario: req.user,
         message: "nombre cambiado"
     })
     }
    
})





module.exports = server;
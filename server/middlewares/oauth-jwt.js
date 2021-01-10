const jwt = require("jsonwebtoken")
const secret = process.env.SECRET_JWT
let oauthJwt =  (req,res,next) => {
    let token = req.get("token")
    
    jwt.verify(token,secret, (err,decoded)=>{
        if(err){
            return res.status(401).json({ok:false,message: "Token no valido"})
        }

        req.user=decoded.user
    })

    next()
}

module.exports = {
    oauthJwt
}
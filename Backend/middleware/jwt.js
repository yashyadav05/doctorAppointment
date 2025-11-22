require("dotenv").config()
const jwt = require('jsonwebtoken')

exports.auth = async(req,res,next)=>{
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
        return res.status(400).json({success:false,message:"Token not found"})
        }
    try {
         const decode = jwt.verify(token,process.env.JWT_SECRET)
         req.user = decode
         next();
    } catch (error) {
        return res.status(401).json({
        success:false,
        message:"Invalid or expired token"
     })
    }
}
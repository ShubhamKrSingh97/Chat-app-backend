const jwt=require('jsonwebtoken');
const User=require('../models/user.model');
require('dotenv').config();
const authenticate= async(req,res,next)=>{
    try{
        const token = req.header('Authorization');
        const decodedObj= jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=await User.findOne({where:{id:decodedObj.id}});
        req.user=user;
        next();
    }catch(err){
        res.status(500).json({message:'You are not authenticated'});
    }
}
module.exports=authenticate;
const jwt=require('jsonwebtoken')
const User=require('../models/user')


exports.authentication=async(req,res,next)=>{
   try {
    const token=req.header('Authorisation')
    const user=jwt.verify(token,'Tarun@123')
    console.log(">>>>>jwt",user)
    console.log(user)
    const auth_user=await User.findById(user.userid)
    console.log(auth_user)
    req.user=auth_user
    next()
   } catch (error) {
    console.log(error)
    res.status(401).json({message:error})
   }
}
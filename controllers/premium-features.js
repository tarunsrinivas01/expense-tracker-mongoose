const Order=require('../models/order')
const User=require('../models/user')
const expense=require('../models/expense')
const sequelize=require('../database/db')


exports.gettheleaderboard=async(req,res,next)=>{
    try{
        const users=await User.find().sort({totalexpenses:-1}).limit(5)
        console.log(users)
        res.status(200).send(users)

        
    }
    catch(err)
    {
        throw new Error(err)
    }

   
}




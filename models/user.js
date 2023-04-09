const mongoose=require('mongoose')

const schema=mongoose.Schema


const userschema=new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
      },
      password:{
        type:String,
        required:true
      },
      ispremiumuser:{
        type:Boolean,
        required:true
      },
      totalexpenses:{
        type:Number,
        required:true,
        default:0
      }
})
module.exports=mongoose.model('user',userschema)

// const Sequelize=require('sequelize')

// const sequelize=require('../database/db')

// const user=sequelize.define('users',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowedNull:false,
//         primaryKey:true
//     },
//     name:{
//         type:Sequelize.STRING,
//         allowedNull:false
//     },
//     email:{
//         type:Sequelize.STRING,
//         allowedNull:false,
//         unique:true
//     },
//     password:{
//         type:Sequelize.STRING,
//         allowedNull:false
//     },
//     ispremiumuser:Sequelize.BOOLEAN,
//     total_expenses:{
//         type:Sequelize.INTEGER,
//         defaultValue:0
//     }
// })
// module.exports=user
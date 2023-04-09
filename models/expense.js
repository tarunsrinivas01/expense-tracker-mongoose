const mongoose=require('mongoose')
const schema=mongoose.Schema;

const expenseschema=new schema({
    amount:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    userId:{
        type:schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})
module.exports=mongoose.model('expenses',expenseschema)
// const Sequelize=require('sequelize')

// const sequelize=require('../database/db')

// const Expense=sequelize.define('exps',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowedNull:false,
//         primaryKey:true
//     },
//     amount:{
//         type:Sequelize.STRING
//     },
//     description:{
//         type:Sequelize.STRING
//     },
//     category:{
//         type:Sequelize.STRING
//     }
// })
// module.exports=Expense
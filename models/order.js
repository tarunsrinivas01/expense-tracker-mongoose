const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    paymentid:{
        type:String
    },
    orderid:{
        type:String
    },
    status:{
        type:String
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model('Order',orderSchema);
// const Sequelize=require('sequelize')

// const sequelize=require('../database/db')
// const Order=sequelize.define('order',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     paymentId:Sequelize.STRING,
//     orderId:Sequelize.STRING,
//     status:Sequelize.STRING
// })
// module.exports=Order

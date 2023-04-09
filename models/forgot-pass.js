const mongoose=require('mongoose');
const schema=mongoose.Schema;

const forgotPasswordschema=new schema({
    id:{
        type:schema.Types.UUID
    },
    active:{
        type:Boolean
    },
    userId:{
        type:schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model('ForgotPassword',forgotPasswordschema);
// const Sequelize = require('sequelize');
// const sequelize = require('../database/db');

// //id, name , password, phone number, role

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = Forgotpassword;
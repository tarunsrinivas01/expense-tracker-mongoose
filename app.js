require('dotenv').config()
const express = require("express");
const app = express();
// const sequelize = require("./database/db");
const mongoose=require('mongoose')
const helmet=require('helmet')
const morgan=require('morgan')
const fs=require('fs')
const path=require('path')
//requiring routes
const userroutes = require("./routes/userroutes");
const expenseroutes=require('./routes/expensesroutes')
const purchaseroutes=require('./routes/purchaseroutes')
const premiumroutes=require('./routes/premium-features')
const forgotroutes=require('./routes/forgot-pass')

// requiring models
const user=require('./models/user')
const expense=require('./models/expense')
const order=require('./models/order')
const forgot=require('./models/forgot-pass')
const files=require('./models/files')
// bodyparser and cors
const bodyParser = require("body-parser");
const cors = require("cors");
const accesslogstream=fs.createWriteStream(
    path.join(__dirname,'access.log',),
    {flags:'a'}
)


// middlewares
app.use(helmet())
app.use(morgan("combined",{stream:accesslogstream}))
app.use(cors());
console.log("entered");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// using routes
app.use("/user", userroutes);
app.use('/expenses',expenseroutes)
app.use('/purchase',purchaseroutes)
app.use('/premium',premiumroutes)
app.use('/password',forgotroutes)

// relations

mongoose.connect('mongodb+srv://tarun:tarun@cluster0.uef6x77.mongodb.net/expense?retryWrites=true&w=majority')
.then(()=>{
  console.log('connected')
  app.listen(3000)
})
.catch(err=>{
  console.log(err)
})
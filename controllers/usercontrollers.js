const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function isstringvalidate(string)
{
    if(string==undefined || string.length===0)return true;
    return false;
}
function generatetoken(id,ispremiumuser)
{
  return jwt.sign({userid:id,ispremiumuser:ispremiumuser},'Tarun@123')
}


exports.signup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name);
    if(isstringvalidate(name)|| isstringvalidate(email)|| isstringvalidate(password))
    {
        return res.status(401).json({err:'something is missing'})
    }
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
      const user=new User({
        name:name,
        email:email,
        password:hash,
        ispremiumuser:false
      })
      await user.save()
      // await user.create({name,email,password:hash})
     res.status(201).json({message:'successfully new user created',success:'true'})
    })
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
exports.login=async(req,res,next)=>{
  try {
    const {email,password}=req.body
    if(isstringvalidate(email)|| isstringvalidate(password))
    {
        return res.status(401).json({err:'something is missing'})
    }
    console.log(email)
    const users=await User.findOne({email:email})
    console.log('>>>>>>>>>',users)
    if(users)
        {
            bcrypt.compare(password,users.password,(err,result)=>{
            if(err)
            {
                throw new Error('something went wrong')
            }
            if(result===true)
            {
                console.log(generatetoken(users._id))
                return res.status(201).json({message:'user logged in','token':generatetoken(users._id,users.ispremiumuser)})
            }
            else{
               return res.status(401).json({message:'password incorrect'})
                 
            }
            })
            
        }
    else{
      return res.status(500).json({message:'user not found',message:'false'})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:err})
  }
}
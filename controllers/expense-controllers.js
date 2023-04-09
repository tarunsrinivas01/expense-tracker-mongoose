const sequelize=require('../database/db')
const exp=require('../models/expense')
const User=require('../models/user')
const Expense=require('../models/expense')
const Downloadfile=require('../models/files')
const AWS=require('aws-sdk')

exports.addexpenses=async(req,res,next)=>
{
    try{
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.choosecategory;
    console.log('>>>>user',req.user)

    // console.log('id>>>>>>>>',req.user.id)
    if(amount===undefined|| amount.length===0||description===undefined||description.length===0||category===undefined||category.length===0)
    {
        return res.status(401).json({message:'parameters are missing'})
    }
    // const data=await exp.create({amount:amount,description:description,category:category,userId:req.user.id},{transaction:t})
    const data=new Expense({
        amount:amount,
        description:description,
        category:category,
        userId:req.user
    })
    await data.save()
    console.log('>>>>data',data)
    const totalexpenses=Number(req.user.totalexpenses)+Number(amount)
    const user=await User.findOne({_id:req.user._id})
    user.totalexpenses=totalexpenses
    await user.save()
    // await t.commit()
    res.status(201).json({newexpenses:data})
    }
    catch(err)
    {
        // await t.rollback()
        console.log(err)
        res.status(500).json({message:err,success:'false'})
    } 
}
exports.getexpenses=async(req,res,next)=>{
    
    try{
        const page=+req.query.page||1;
        console.log('>>>>>>>>>',page)
        const limit=+req.query.limit||5;
        console.log('>>>>>>>>>',limit)
        const totalexpenses=req.user.totalexpenses
        const data =await Expense.find({userId:req.user._id}).
        skip((page-1)*limit).
        limit(limit)
        console.log('>>>>data',data)
        // const data=await exp.findAll({where:{userId:req.user.id},
        // offset:(page-1)*limit,
        // limit:limit})
        console.log('>>>>>>>',data)
        res.status(200).json({
            success:true,
            allexpenses:data,
            currentpage: page,
            hasnextpage: (limit * page < totalexpenses.length),
            nextpage: page + 1,
            haspreviouspage: page > 1,
            previouspage: page - 1
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({err:err,success:'false'})
    }
}
exports.deleteexpenses=async(req,res,next)=>{
    try{
        const expid=req.params.id
        console.log('>>>>>expid',expid)

        const delamount=await Expense.findOne({_id:expid})
        // const delexpense=await exp.findByPk(expid)
        // constdelamount=delexpense.amount;
        console.log('>>>',delamount)
        const response=await Expense.findByIdAndDelete({_id:expid})
        if(response===0)
        {   
            
            res.status(401).json({message:'no expense found',success:'false'})
        }
        else{
            const totalexpenses=Number(req.user.total_expenses)-Number(delamount.amount)
            await req.user.updateOne({_id:req.user._id},{ totalexpenses:String(totalexpenses)})
            res.status(200).json({message:'expense deleted',success:'true'})
        }
       
    }
    catch(err){
        console.log(err)
        res.status(500).json({err:err,success:'false'})
    }
}
exports.editexpenses = async (req, res, next) => {
    try {
        const expid = req.params.id;
        if (!expid) {
            return res.status(400).json({ message: "Invalid request parameter" });
        }
        const editexpense = await Expense.findOne({ _id: expid, userId: req.user._id });
        if (editexpense) {
            const prevexp=Number(editexpense.amount)
            // console.log(editexpense[0].amount)
            // console.log('>>>>',totalexpenses)
            console.log('>>>',Number(editexpense.amount))
            editexpense.amount = req.body.amount || editexpense[0].amount;
            editexpense.description = req.body.description || editexpense[0].description;
            editexpense.category = req.body.choosecategory || editexpense[0].category;
            await editexpense.save();
            const totalexpenses=Number(req.user.totalexpenses)+Number(req.body.amount)-prevexp
            // console.log('>>>>',totalexpenses)
            await req.user.updateOne({totalexpenses:totalexpenses},{_id:req.user._id})
            console.log(editexpense);
            res.status(200).json({ newexpenses: editexpense });
        } else {
            res.status(404).json({ message: "Expense not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
function uploadtoS3(data,filename)
{
  const BUCKET_NAME='expensetracker1'
  const IAM_USER_KEY='AKIAYQF6SJQJ26LSJ6UW'
  const IAM_USER_SECRET='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'

  let s3Bucket=new AWS.S3({
    accessKeyId:IAM_USER_KEY,
    secretAccessKey:IAM_USER_SECRET,
    
  })

    var params={
      Bucket:BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params,(err,s3response)=>{
            if(err)
            {
              console.log(err)
              reject(err)
            }
            else{
              console.log('success',s3response)
              resolve(s3response.Location)
            }
          })
    })
    
}

exports.downloadexpenses=async(req,res,next)=>{
    try {
        const id=req.user._id
  const expense=await Expense.findAll({where:{userId:id}})
  const stringifiedexpenses=JSON.stringify(expense)
  const filename=`expenses${id}/${new Date()}.txt`
  const fileUrl=await uploadtoS3(stringifiedexpenses,filename)
  await Downloadfile.create({url:fileUrl,userId:id});
  res.status(201).json({fileUrl,success:'true'})
    } catch (error) {
        console.log(error)
        res.status(401).json({fileUrl:'',success:'false',err:error})
    }
    
}
exports.files=async(req,res,next)=>{
    try {
        const id=req.user._id

        const files=await Downloadfile.findAll({where:{userId:id}})
        // if(files.length>0)
        // {
            console.log(files.url)
            res.status(201).json({files:files,message:'success'})
        // }
    } catch (error) {
        res.status(401).json({err:'no files found'})
    }
}
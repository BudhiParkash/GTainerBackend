const express = require('express')
const User = require('../model/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const adminauth = require('../middleware/adminauth')
const router = new express.Router()
var mongoose = require('mongoose');

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Upload Slip-Pic
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null , new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
const fileFilter = (req,file,cb) =>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }

}
const upload = multer({
    storage : storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Add Cetificate

router.post('/v1/users/addcerti',upload.single('DocImage'),auth,async(req,res)=>{

    user = req.user;
    const picPath =req.file.path
 try {
        // console.log(req.file.path);
         
             await user.certificates.push({'pic':picPath})
             await user.save()
          return   res.status(201).send(req.user)
     
         } catch (error) {
             res.status(500).send(error)
         }



})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Add OwnPic
router.post('/v1/users/ownpic',upload.single('DocImage'),auth,async(req,res)=>{

    user = req.user;
    const picPath =req.file.path
 try {
        // console.log(req.file.path);
         
             await user.trainerPic.push({'pic':picPath})
             await user.save()
          return   res.status(201).send(req.user)
     
         } catch (error) {
             res.status(500).send(error)
         }



})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get Uploaded Certificates
router.get('/v1/users/getcerti',auth,async(req,res)=>{


    try {
        user = req.user;
    if(!user){
    res.status(404).send()
    }

    
   
    return    res.status(200).send(user.certificates)
        } catch (error) {

         return   res.status(404).send(error)

    }

})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get trainers pic by user/trainer
router.get('/v1/users/trainerpic',auth,async(req,res)=>{


    try {
        user = req.user;
    if(!user){
    res.status(404).send()
    }

    
   
    return    res.status(200).send(user.trainerPic)
        } catch (error) {

         return   res.status(404).send(error)

    }

})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//New User Create
router.post('/v1/users', async (req,res)=>{
   

    //Set New User Value
     user = new User(req.body)

    try {
        findUser = await User.findOne({"phoneNum":user.phoneNum})

        if(!findUser){
            await user.save() 
            const token = await user.generateAuthToken()
            return  res.status(201).send({user,token})
        }
        else{
            const token = await findUser.generateAuthToken()
            user = findUser
            return  res.status(200).send({user,token})
        }
    } catch (error) {
        return res.status(500).send(error)
    }
        
        

})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get User List for admin
router.get('/userlist',adminauth,async(req,res) =>{
try {
        const user = await User.find({})

        if(user.length == 0){
            return    res.status(404).send('Not found')
        }
        return  res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Get profile
router.get('/users/me',auth,async (req,res)=>{
 res.send(req.user)
    })
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Update Api for user
router.patch('/v1/app/users/me/update', auth,async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['user_name','email','city']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }
        try {
                updates.forEach((update)=>{
                req.user[update] = req.body[update]

        })
         await req.user.save()
         res.send(req.user)

    } 
    catch (e) {
        res.status(400).send(e)
    }

})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//to Create Service Provider Or Trainer
router.patch('/v1/app/user/trainer', auth,async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['user_name','email','city','aboutUser','address','gender','trainerAvailable','language','experiance']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperator){
        return res.status(400).send({error : 'Invalid updates'})
    }
        try {
                updates.forEach((update)=>{
                req.user[update] = req.body[update]

        })

        req.user.typeOfUser = 1
         await req.user.save()
         res.send(req.user)

    } 
    catch (e) {
        res.status(400).send(e)
    }

})
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get Top Trainers
router.get('/v1/toptrainers',auth,async(req,res) =>{

    const hospi = await User.find({'profileVerified':true}).sort({ranking:-1}).limit(parseInt(req.query.limit||5))
    if(hospi.length == 0 ){
        return res.status(404).send({"error":"Not found"})
    }

    return res.status(200).send(hospi)

})
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get  normal / all Trainers
router.get('/v1/trainers/get',auth,async(req,res) =>{

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const results = {}

        try{
            const totalResult = await User.find({'profileVerified':true}).countDocuments()
            console.log(totalResult);
            results.searchResult   = await User.find({'profileVerified':true}).limit(limit).skip(startIndex).exec()
            if (endIndex < totalResult) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
                }
                if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
                }
        }catch(e){
            res.status(500).json({ message: e.message })
           }
         return    res.status(200).send(results)

        

})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get  Booking
router.get('/v1/tranier/get',auth,async(req,res)=>{
            
    id = req.query.tranierid
    var objectId = mongoose.Types.ObjectId(id);
    const trainer = await User.findById(objectId)


    if(trainer == null){
        res.status(404).send()
    }
    else{
        res.status(200).send(trainer)
    }

})







module.exports = router

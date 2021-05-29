const express = require('express')
const Booking = require('../model/booking')
const auth = require('../middleware/auth')
const User = require('../model/user')
const router = new express.Router()
var mongoose = require('mongoose');


//Create Booking
router.post('/v1/booking',auth,async (req,res)=>{

     const book = new Booking(req.body)
try {
        await book.save()
        res.status(201).send(book)

    } catch (error) {
        res.status(400).send(error)
    }
})

//Get Booking
router.get('/v1/bookings',auth,async(req,res)=>{
            
            id = req.user._id
            var objectId = mongoose.Types.ObjectId(id);
            const trainer = await Booking.find({'buyerId' : objectId})


            if(trainer == null){
                res.status(404).send()
            }
            else{
                res.status(200).send(trainer)
            }
    
    })


module.exports = router
const mongoose = require('mongoose')


const booking_schema = new mongoose.Schema({
    
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    trainerID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    payment:{
        type:Number,
        required:true
    },
    periodOfBooking:{
        type:String
    },
    lastDateOfBook:{
        type:String
    }
    
},

{
    timestamps:true
})




const Booking = mongoose.model('Booking',booking_schema)



module.exports = Booking
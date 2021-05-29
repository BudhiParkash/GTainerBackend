const mongoose = require('mongoose')


const locations_schema = new mongoose.Schema({
    
    city:{
        type:String,
        unique:true
    }
    
},

{
    timestamps:true
})




const Locations = mongoose.model('Location',locations_schema)



module.exports = Locations
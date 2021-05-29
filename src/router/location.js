const express = require('express')
const Locations = require('../model/location')
const auth = require('../middleware/auth')
const router = new express.Router()


//Create City (Location)
router.post('/location/define',auth,async (req,res)=>{

     const city = new Locations(req.body)
try {
        await city.save()
        res.status(201).send(city)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/city',auth,async(req,res)=>{
    //.........................................................................
    //Search City By name
    // /city?c="hisar"
    if(req.query.c){
        try {

            var regex = new RegExp(req.query.c, 'i');
            const searchResult   = await Locations.find({city:regex})
            if(searchResult.length == 0){
             return   res.status(404).send('Not found')
            }
               return     res.send(searchResult)
        } catch (error) {
            res.status(500).send(error)
        }
    }
    
    
    //.....................................................................................
    //Get all cites
    try {
        const cites = await Locations.find({}).limit(parseInt(req.query.limit||10))
        if(!cites){
         return   res.status(404).send('Not found')
        }
          return      res.send(cites)
    } catch (error) {
        res.status(500).send(error)
    }
     
       
    
    
    })


module.exports = router
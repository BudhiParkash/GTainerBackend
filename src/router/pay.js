const Razorpay = require('razorpay')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

var instance = new Razorpay({
    key_id: 'rzp_live_UbNAc0ejv51g8u',
    key_secret: 'bZQppRFx1AyovA2f3YkpKn8p',
    headers: {
      "X-Razorpay-Account": "FBzFxxhn3qVFk7"
    }
  });


 router.post('/pay',async (req,res)=>{

  var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "Receipt-1",
    payment_capture: '1'
  };

 
try {
         instance.orders.create(options, function(err, order) {

          if(order != null){
            res.status(201).send([{order},{ key_id: 'rzp_live_UbNAc0ejv51g8u'}]) 
          }
          else{
            res.status(400).send('Payment Not Done')
          }

        
     
  });
    } catch (error) {
       res.status(500).send(error)
   }
})

module.exports = router
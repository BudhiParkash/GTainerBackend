const Razorpay = require('razorpay')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

var instance = new Razorpay({
    key_id: 'rzp_test_EeYjIbDHVrm4pO',
    key_secret: 'wRVMfpQqgNOqpGH0bghSMrgM',
    headers: {
      "X-Razorpay-Account": "EdH1lpSCoXSrk0"
    }
  });


 router.post('/pay',auth,async (req,res)=>{

  var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "Receipt-1",
    payment_capture: '1'
  };

 
try {
         instance.orders.create(options, function(err, order) {

          if(order != null){
            res.status(201).send([{order},{ key_id: 'rzp_test_EeYjIbDHVrm4pO'}]) 
          }
          else{
            //console.log(err)
          }

        
     
  });
    } catch (error) {
       res.status(500).send(error)
   }
})

module.exports = router



 // instance.orders.all().then(console.log).catch(console.error);
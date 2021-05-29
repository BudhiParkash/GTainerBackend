const express = require('express')
require('./db/mongoose')
const path = require('path')
const cors = require('cors')

const adminRouter = require('./router/admin')


const locationRouter = require('./router/location')
const userRouter = require('./router/user')
const payRouter = require('./router/pay')
const bookingRouter = require('./router/booking')


const publicDirectoryPath = path.join(__dirname,'./public')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(publicDirectoryPath))
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use(express.json())
app.use(locationRouter)
app.use(userRouter)
app.use(bookingRouter)
app.use(payRouter)
app.use('/admin',adminRouter)







app.listen(port,()=>{

    console.log('Your server working on port ' + port);
    
})

const main = async() =>{

console.log("Ready");

}
main()
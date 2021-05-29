const mongoose = require('mongoose')

mongoose.connect(process.env.MONOGO_DB_URL,{
    useUnifiedTopology:true,
    useCreateIndex:true,
    useNewUrlParser: true 
})

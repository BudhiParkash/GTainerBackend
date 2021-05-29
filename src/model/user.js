const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const Books = require('../model/booking')


const user_schema = new mongoose.Schema({
   
    phoneNum:{
        type:Number,
        required:true,
        unique:true
       
    },
    
    profileVerified:{
        type:Boolean,
        default:false
    },
    expiredCertiDate:{
        type:String
    },

    trainerAvailable:{
        type:Boolean,
        default:false
    },

    trainerSlotFull:{
        type:Boolean,
        default:false
    },

    language:{
        type:String
    },

    experiance:{
        type:String
    },

    typeOfUser:{
        type:Number,
        enum: [0,1],
        default:0

    },
    price :{
        type:Number
    },
    aboutUser :{
        type:String
    },
    address:{
            type:String
    },
    user_name:{
        type: String
    },
    gender:{
        type:String
    },
    city:{
        type:String
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){

                throw new Error('Enter a valid email')
            }
        }
    },
     tokens:[{
            token:{
                type:String,
                required:true
            }
        }], 
        
        certificates:[

            {
                pic:{
                    type:String
                }

            }

        ],
        trainerPic:[

            {
                pic:{
                    type:String
                }

            }

        ],
        ratings:[

            {
                rating:{
                    type:String
                },
                users_id:{
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref:'User'
                }
    
            }
        ],
        ranking:{
            type:Number,
            default:0
        }

  

    
},{
    timestamps:true
})


// user_schema.virtual('bookings', {
//     ref: Books,
//     localField: '_id',
//     foreignField: 'userId'
// })


// user_schema.virtual('category', {
//     ref: Category,
//     localField: '_id',
//     foreignField: 'user_creatorId'
// })

// user_schema.virtual('rating', {
//     ref: Hospital,
//     localField: '_id',
//     foreignField: 'users_id'
// })




user_schema.methods.toJSON = function () {
    
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

user_schema.statics.findByCredential = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to find')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw  new Error('Unable to login')
    }
 return user

}

user_schema.statics.findByCredentialPhone = async (contact,password) =>{
    const user = await User.findOne({contact})

    if(!user){
        throw new Error('Unable to find')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw  new Error('Unable to login')
    }

    return user

}



user_schema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'1q1q2w')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}




user_schema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){

        user.password = await bcrypt.hash(user.password,8)

    }
     next()
})








const User = mongoose.model('User',user_schema)



module.exports = User
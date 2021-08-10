const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose')
require("../model/location")
require("../model/user")
//const Category = mongoose.model("category")
const Locations =  mongoose.model("Location")
const User = mongoose.model("User")

const givePermissions = ({currentAdmin}) => {
  return currentAdmin.role === "super-admin"
}

AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
  resources: [{
    resource : User,
    options :{
        actions : { edit : {isAccessible : givePermissions},
                    delete : {isAccessible : givePermissions},
                    new : {isAccessible : givePermissions} }
    },},
    {
      resource : Locations,
      options :{
          actions : { edit : {isAccessible : givePermissions},
                      delete : {isAccessible : givePermissions},
                      new : {isAccessible : givePermissions} }
      },
   }
//,{
//     resource : Category,
//     options :{
//         actions : { edit : {isAccessible : givePermissions},
//                     delete : {isAccessible : givePermissions},
//                     new : {isAccessible : givePermissions} }
//     },
// },
],
  drootPath: '/admin',
  branding: {
  logo: 'https://vignette.wikia.nocookie.net/jamesbond/images/e/ec/James_Bond_Faceless_Profile.png/revision/latest/scale-to-width-down/340?cb=20120814142428',
  companyName: 'BuildTape',
  softwareBrothers: false  
  },
  dashboard: {
  component: AdminBro.bundle('./dashboard/customAdmin.jsx')
  },
})

const ADMIN = {
    email : process.env.ADMIN_EMAIL || 'Admin',
    password: process.env.ADMIN_PASSWORD || 'admin',
    role:"super-admin"
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,{
    cookieName: process.env.ADMIN_COOKIE_NAME || 'Admi_h_re',
    cookiePassword:process.env.ADMIN_COOKIE_PASSWORD || 'Mere_nameSahil_h@@&_cookies_koi_hack_niREga&*',
    authenticate : async(email ,password) =>{

        if(email === ADMIN.email && password === ADMIN.password){
            return ADMIN
        }
        return null
    }
})

module.exports = router
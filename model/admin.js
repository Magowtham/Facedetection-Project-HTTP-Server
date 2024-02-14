const mongoose=require("mongoose");

const Admin=mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}
})

module.exports=mongoose.model("Admins",Admin);
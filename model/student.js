const mongoose=require("mongoose");


const Student=mongoose.Schema({
    usn:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    contact_number:{type:String,required:true},
    attended_class:{type:String,default:"0"},
    percent:{type:String,default:"0%"}
})


module.exports=mongoose.model("Students",Student);
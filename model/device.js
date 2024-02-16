const mongoose=require("mongoose");

const Device=mongoose.Schema({
    status:{type:Boolean,reqouired:true}
})


module.exports=mongoose.model("Device",Device);
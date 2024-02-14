const mongoose=require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect("");
        console.log("connected to MongoDB");
    }catch(error){
        console.log(error);
    }
}


module.exports=connectDB;
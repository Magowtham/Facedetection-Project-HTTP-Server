const mongoose=require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect("mongodb+srv://rebot2024:yQ6yZCcq5Qc7qKhN@rebot.o2kdg6l.mongodb.net/StudentsAttendence?retryWrites=true&w=majority");
        console.log("connected to MongoDB");
    }catch(error){
        console.log(error);
    }
}


module.exports=connectDB;
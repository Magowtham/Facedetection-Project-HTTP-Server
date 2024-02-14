const express=require("express");
const mqtt=require("mqtt");
const StudentSchema=require("./model/student");
const connectDB=require("./config/db_connect");

const app=express();

const PORT=5000;
const BokrerURL="";

//database connection
connectDB();

const client=mqtt.connect();

client.on("connect",()=>{
    console.log("connected to MQTT broker");
})

client.on("error",(err)=>{
    console.log(`MQTT error : ${err}`);
})

client.on("close",()=>{
    console.log("disconnected from MQTT broker");
})

app.get("/start",(req,res)=>{
    const {time}=req.body;
    const topic="http";
    try{
        client.publish(topic,{st:1});

         setTimeout(()=>{
            client.publish(topic,{st:0});
        },time*1000);

    }catch(error){
        console.log(error);
    }
    
})

app.post("/register",async (req,res)=>{
    const {usn,name,email,contact_number}=req.body;

    const Student=new StudentSchema({
        usn,
        name,
        email,
        contact_number
    });
    try{
        await Student.save();
        res.status(200).json({message:"student registered successfully"});
    }catch(error){
        res.status(500).json({error:"failed  to register student"});
    }
})


app.listen(PORT,()=>{
    console.log(`Server running @ PORT : ${PORT}`);
})
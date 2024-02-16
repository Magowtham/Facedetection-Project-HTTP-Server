const express=require("express");
const mqtt=require("mqtt");
const cors=require("cors");
const StudentSchema=require("./model/student");
const AdminSchema=require("./model/admin");
const connectDB=require("./config/db_connect");

const app=express();

const PORT=5000;

//middlewares
app.use(express.json());
app.use(cors({origin:["http://localhost:3000"]}));

const BokrerURL="";

//database connection
connectDB();

const client=mqtt.connect("mqtt://localhost:1883");

client.on("connect",()=>{
    console.log("connected to MQTT broker");
})

client.on("error",(err)=>{
    console.log(`MQTT error : ${err}`);
})

client.on("close",()=>{
    console.log("disconnected from MQTT broker");
})

app.post("/start",(req,res)=>{
    const {time}=req.body;
    const topic="pii";
    try{
        client.publish(topic,JSON.stringify({st:1,tm:Number(time)}));
        res.status(200).json({message:"face detection started"})
    }catch(error){
        res.status(500).json({error:"oops something went wrong!"})
        console.log(error);
    }
    
})

app.post("/register",async (req,res)=>{
    const {usn,name,email,contact_number}=req.body;

    const [isStudentExsits]=await StudentSchema.find({usn});

    if(isStudentExsits){
        res.status(400).json({error:"student already exists"});
        return;
    }
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

app.get("/users",async (req,res)=>{
    try{
        const students=await StudentSchema.find();
        res.status(200).json({students});
    }catch(error){
        res.status(500).json({error:"failed to fetch the students data"})
    }
    
})

app.post("/signup",async (req,res)=>{
    const {email,password}=req.body;
    const [isAdminAlreadyExists]=await AdminSchema.find({email});

    if(isAdminAlreadyExists){
        res.status(400).json({error:"admin is already registered"});
        return;
    }
    const Admin=new AdminSchema({email,password});

    await Admin.save();
    res.status(200).json({message:"admin registration successfull"});
})

app.post("/login",async (req,res)=>{
    const {email,password}=req.body;

    try{
        const [user]=await AdminSchema.find({email});

        if(!user){
            res.status(404).json({error:"admin not exists"});
            return;
        }
    
        if(user.password===password){
            res.status(200).json({message:"login successfull"});
        }else{
            res.status(401).json({message:"incorrect password"});
        }
    }catch(error){
        res.status(500).json({error:"oops something went wrong!"})
    }
   
})

app.post("/update",async (req,res)=>{
	const {usn}=req.body;
	try{
        const [isUserExists]=await StudentSchema.find({usn});
	
    if(!isUserExists){
        res.status(400).json({error:"user not exists"});
        return;
    }

    console.log(isUserExists);
	
    const attendedClases=Number(isUserExists.attended_class);
    console.log(attendedClases);
    const totalNumberOfClasses=Number(isUserExists.total_class);
    console.log(totalNumberOfClasses);
    const percent=(Number(isUserExists.percent)/Number(totalNumberOfClasses))*100;

    console.log(percent);

    await StudentSchema.updateOne({usn},{$set:{attended_class:attendedClases+1,percent}});

    res.status(200).json({message:"update successfull"})
    }catch(error){
        console.log(error);
        res.status(500).json({error:"something went wrong"});
    }

})



app.listen(PORT,()=>{
    console.log(`Server running @ PORT : ${PORT}`);
})

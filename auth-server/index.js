import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/database.js";
import router from "./routes/user.route.js";
import cors from "cors";
import { getAllUSers } from "./controllers/getAllUsers.js";




const app=express();
dotenv.config();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`]
   }));
  


app.use("/auth",router)
app.use("/users",getAllUSers)
const PORT=process.env.PORT 

app.get("/",(req,res)=>{
    res.json({message:"Welocme to Auth Server"});
})

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is Listening on PORT ${PORT}`)
})
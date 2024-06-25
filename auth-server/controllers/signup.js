import {z} from "zod";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateJWT from "../utils/generateJWT.js";


const signup=async(req,res)=>{

    try{

        const {username,password}=req.body;
        console.log("Username",username);
        console.log('password',password)
        const schema=z.object({
            username:z.string(),
            password:z.string()
        })

        const response=schema.safeParse({username,password})

        if(!response.success){
            return res.status(400).json({
                message:response.error.errors
            })
        }

        const user= await User.findOne({username});

        if(user){
            return res.status(201).json({
                message:"User Already Exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const userResponse=await User.create({username,password:hashedPassword});
        console.log(userResponse);

        const token=generateJWT(userResponse._id);

        const options={
            maxAge: 15*24*60*60*1000, //miliseconds
            httpOnly: true,
            sameSite:"strict",
            secure: false
        }
        
        return res.cookie("JWT",token,options).status(201).json({
            message:"User Created Successfully"

        })
    }catch(e){
        console.log("something went wrong while Sign up",e)
        return res.status(500).json({
            message:e.message
        })
    }

}

export default signup;
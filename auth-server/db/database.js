import mongoose from "mongoose";

const connectDB=async(req,res)=>{
    try{

        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connection to DB is Successfull");

    }catch(e){
        console.log("Connection to DB Failed",e)
    }
}

export default connectDB;

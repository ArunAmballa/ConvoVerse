import User from "../models/user.model.js"

export const getAllUSers=async(req,res)=>{

    try{


        const username=req.user.username;

        console.log("Usernmae",username);
        const users=await User.find({},'username')

        return res.status(200).json({users,username:username})

    }catch(error){
        console.log("Something went wrong while fetching all users",error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while Fetching Users"
        })
    }
}
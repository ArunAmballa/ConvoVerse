import jwt from "jsonwebtoken";

export const auth=async(req,res,next)=>{

    try{
        const token=req.cookie.JWT;

        if(!token){

            return res.status(401).json({
                success:false,
                message:"Missing Token"
            })
           
        }

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            req.userId=decode.userId;
            req.username=decode.username;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Invalid Token"
            })
        }

        next();

    }catch(error){
        console.log("Something went Wrong while Auth Middleware",error)

        return res.status(500).json({
            message:"Something went wrong while Auth Middleware",
            success:false
        })
    }
   

}
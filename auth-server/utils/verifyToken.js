import jwt from "jsonwebtoken"

const verifyToken=async(req,res,next)=>{

    try{

        const token=req.cookies.JWT;

        console.log(token)

        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }

        try{
            const decode=jwt.decode(token,process.env.JWT_SECRET);
            req.user=decode;



        }catch(error){
            return res.status(500).json({
                messagege:"Invalid JWT "
            })
        }

        next();

    }catch(error){
        return res.status(500).json({
            message:"Something went wrong while validating JWT"
        })
    }
}

export default verifyToken;
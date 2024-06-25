import jwt from "jsonwebtoken";
const generateJWT=(userId)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"});
    return token;
}

export default generateJWT;
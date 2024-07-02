import jwt from "jsonwebtoken";
const generateJWT=(userId,username)=>{

    const token=jwt.sign({userId,username},process.env.JWT_SECRET,{expiresIn:"15d"});
    return token;
}

export default generateJWT;
import jwt from 'jsonwebtoken'

const authUser=async(req,res,next)=>{
    const{utoken}=req.headers;
    
    try{
        const token_decode=jwt.verify(utoken,process.env.JWT_SECRET);
        req.body.id=token_decode.id;
        next();
    }catch(err){
        console.log(err)
    }
}

export default authUser;
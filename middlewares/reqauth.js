const jwt=require("jsonwebtoken");
const user=require("../models/user");
const JWT_SECRET="Aaryan@321#";

async function requireAuth(req , res , next){
    // console.log("***********************************");
    // console.log("inside requireAuth");
    const token=req.cookies?.token;
    //console.log("reqAuth token is " , token)
    if(!token){
        return res.redirect("/auth/signin")
    }
    try{
        const decoded=jwt.verify(token ,JWT_SECRET );
        //console.log("✅ Decoded token in requireAuth:", decoded);
        const USER=await user.findById(decoded._id);
       // console.log("reqAuth user is " , USER);
        if(!USER){
            return res.redirect("/");
        }
        req.user=USER;
       // console.log("****************end");
        
        next();
        
    }
    catch(err){
      //  console.log("JWT Verification failed. in reqAuth ");
        res.redirect("/auth/signin");
        next();
    }
    


}

module.exports= requireAuth;

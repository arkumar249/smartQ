const Token=require("../models/token");
const {getIO}=require("../socket");

async function updateAllTokenHolder(storeId){
    const io=getIO();
    const tokens=await Token.find({store:storeId , status:"active" }).sort({tokenNumber:1});
    const averageWaitTime=3;
    tokens.forEach((token , index)=>{
        const position=index+1;
        const estimatedWaitTime=index*averageWaitTime;
        io.to(token.user.toString()).emit("queuePositionUpdate" , {
            tokenId:token._id,
            position,
            estimatedWaitTime
        });
    })
}

module.exports={updateAllTokenHolder};
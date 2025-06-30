// routes/api.js (or in user routes)
const express = require('express');
const router = express.Router();
const Token = require("../models/token");
const requireAuth = require("../middlewares/reqauth");
const User = require('../models/user');
const Store=require("../models/store");

// api for getting token status 
router.get("/token-status/:tokenId", async (req, res) => {
    try {
        const token = await Token.findById(req.params.tokenId).populate("store");
        if (!token) return res.status(404).json({ error: "Token not found" });

        const activeTokensAhead = await Token.countDocuments({
            store: token.store._id,
            status: "active",
            tokenNumber: { $lt: token.tokenNumber },
            //createdAt: { $gte: today }
        });

        const averageTime = token.store.averageWaitTime; // in minutes
        const estimatedWaitTime = activeTokensAhead * averageTime;

        res.json({
            currentPosition: activeTokensAhead + 1, // including user's own token
            estimatedWaitTime,
            status: token.status,
            storeName: token.store.name,
        });
    } catch (err) {
        console.error("Error fetching token status:", err);
        res.status(500).json({ error: "Failed to fetch token status" });
    }
});
router.get("/store/:storeId" ,async  (req , res)=>{
    try{
        const storeId=req.params.storeId;
        const store=await Store.findById(storeId);
        if(!store){
            return res.status(404).json({error:"store not found"});
        }
        return res.json(store);
        
    }
    catch(err){
        return res.status(500).json({error:"Internal Server Error."});
    }
})
// api for getting all the tokens requested by user
router.get("/tokens/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).
            populate({
                path: "tokensRequested",
                populate: ({
                    path: "store",
                    select: "name address"
                })
            });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }
        return res.status(200).json({
            success: true,
            tokens: user.tokensRequested
        })
    }
    catch (err) {
        console.log("Error fetching user Requested Tokes:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }


})
module.exports = router;

const express = require('express');
const requireAuth = require('../middlewares/reqauth'); // protects the route
const authorizeRoles = require("../middlewares/authorizeRoles");

const { getIO } = require("../socket");


const Token = require('../models/token');
const Store = require('../models/store');
const User = require('../models/user');
const router = express.Router();
const io = getIO();
//updating queue position for each user
const {updateAllTokenHolder}=require("../utils/queueUpdate");

router.get('/', requireAuth, authorizeRoles("user"), async (req, res) => {
  const user = req.user;
  let userToken;
  if(user.ActiveToken){
    userToken=await Token.findOne({user:user._id , status:"active"}).populate("user store");
  }
  const stores = await Store.find({});
  res.render('user_dash', {
    title: 'User Dashboard',
    user,
    stores,
    userToken

  });
});

// token Generation page
router.get("/token", requireAuth , async (req, res) => {
  const user = req.user;
  // console.log('inside /token*********************************');
  // console.log('user' , user);
  const stores = await Store.find({});
  if(user.ActiveToken){
    console.log("warning : already active token");
    return res.redirect("/user");
  }
  res.render("tokenGeneration", {
    user, stores
  });
})

// Generate Token Route 
router.post("/generate-token", requireAuth, async (req, res) => {

  try {
     console.log("********************************inside generate token**************");
    console.log("store id from qr scanned" , req.body.storeId);
    const storeId = req.query.q || req.body.storeId;
   // if(!storeId) storeId= ;
   
  //  console.log("we found store", storeId);
  //  console.log("REQ.USER:", req.user);
    if (req.user.ActiveToken) {
      res.redirect("/user");
    }
    const store = await Store.findByIdAndUpdate(storeId,
      { $inc: { tokenCounter: 1 } },
      { new: true }
    );
  //  console.log("store is", store);

    if (!store) {
      return res.status(404).send("store not Found.");
    }

    const token = await Token.create({
      store: storeId,
      user: req.user._id,
      tokenNumber: store.tokenCounter,
    });
    if (!token) {
   //   console.log("token document is not created ");
      return res.redirect("/user");
    }
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        ActiveToken: true,
      },
      $push: {
        tokensRequested: token._id
      }
    });
    io.to(token.store.toString()).emit("storeQueueUpdate", {
      token, storeId
  });

 // await updateAllTokenHolder(storeId);

   // console.log("Token created ", token);
    res.redirect("/user")
  }
  catch (err) {
   // console.log("Token Generation failed", err);
    res.status(500).send("Internal Server error");

  }
})

router.post("/token-delete", requireAuth, async (req, res) => {
  try {
    const user = req.user;
    //console.log(user);
    const token = await Token.findOneAndUpdate({ user: user._id, status: "active" }, {
      $set: { status: "cancelled" },
    });
    if (!token) {
      console.log("token to be deleted not found");
      return res.status(404).send("No active Token found to Delete");
    }
    const storeId=token.store;


    await User.findByIdAndUpdate(user._id , {
      $set:{ActiveToken:false}
    })
    io.to(token.store.toString()).emit("storeQueueUpdate", {
      token, storeId
  });

  await updateAllTokenHolder(storeId);

    console.log("Token deleted successfully");
    res.redirect("/user");
  }
  catch (err) {
    console.log("error", err);
    return res.status("Internal Server Error", err);
  }
})
router.get("/token-history" , requireAuth , async (req , res)=>{
  const userId=req.user._id;
  const user=await User.findById(userId).populate(
    {
      path:"tokensRequested", 
      populate:{
        path:"store" , 
        select:"name address"
      },
      options:{sort:{tokenNumber:-1}}
    }
  )
  return res.render("userTokenHistory" , {
    user
  })
})


module.exports = router;
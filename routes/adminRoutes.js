const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/reqauth');

const Store = require('../models/store');
const Token = require('../models/token');
const User = require('../models/user');
const { getIO } = require("../socket");
const io = getIO();

const {updateAllTokenHolder}=require("../utils/queueUpdate");

// Admin Dashboard
router.get('/', requireAuth, async (req, res) => {
  try {
    const store = await Store.findOne({ admin: req.user._id });
    console.log("store" , store);
    let tokens = [];

    if (store) {
      tokens = await Token.find({ store: store._id }).populate('user');
      console.log(tokens);
    }

    res.render('adminDashboard', {
      user: req.user,
      store,
      tokens,
    });
  } catch (err) {
    console.error(err);
    res.render('adminDashboard', { user: req.user, store: null, tokens: [] });
  }
});

// Add Store
router.post('/add-store', requireAuth, async (req, res) => {
  const { name, address, contact } = req.body;
console.log("POST /add-store without auth");
  await Store.create({
    name,
    address,
    contact,
    admin: req.user._id,
  });

  res.redirect('/admin');
});

// Update Out-of-Stock List
router.post('/update-outofstock', requireAuth, async (req, res) => {
  const list = req.body.outOfStockList.split(',').map(med => med.trim());
  await Store.findOneAndUpdate({ admin: req.user._id }, { outOfStock: list });
  res.redirect('/admin');
});

// Update Token Status
router.post('/update-token/:id', requireAuth, async (req, res) => {
  const {action } = req.body;
  const token=await Token.findByIdAndUpdate(req.params.id , 
    {status:action},
    {new :true}, 
  );
   await User.findByIdAndUpdate(token.user , {
      $set:{ActiveToken:false}
    })

  // if(token){
  //   // io.to(token.store._id.toString()).emit("tokenStatusChanged" , {  // might remove 
  //   //   storeId:token.store._id,
  //   //   tokenId:token._id
  //   // })
  // }
  await updateAllTokenHolder(token.store);
  if(token.user){  // it will go to only one user whose status is change
     console.log("*****************this user token status sent from admin")
    io.to(token.user.toString()).emit("userTokenStatusChanged" , {
     
      userId:token.user,
      tokenId:token._id,
      status:action,
    }) 
  }

  res.redirect('/admin');
});

module.exports = router;

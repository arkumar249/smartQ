const express=require("express");

const isLoggedIn=require("../middlewares/isLoggedin");
const router = express.Router();

// Home route ("/")
router.get("/", isLoggedIn, (req, res) => {
  // If not logged in, this will be rendered
  
  console.log("rendering home page")
  res.render("home", {
    title: "Welcome to Smart Queue System",
    isAuthenticated: false,
  });
});

// Login route





module.exports=router;
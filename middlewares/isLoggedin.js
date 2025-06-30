// middlewares/isLoggedIn.js
const jwt=require("jsonwebtoken");
const User=require( "../models/user");
const JWT_SECRET="Aaryan@321#";

async function isLoggedIn(req, res, next) {
  const token = req.cookies?.token;
  // console.log("**************************************");
  // console.log("inside isLogged In");
  // console.log("value of token is :" , token);
  if (!token) return next(); // No token = not logged in

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);
    // console.log(decoded);
    // console.log("user is" , user);
    if (!user) return next();
//console.log("we found the user with jwt as verified isLoggedIn");
    // User is logged in — redirect to appropriate dashboard
    if (user.role === "admin") return res.redirect("/admin");
    if (user.role === "superadmin") return res.redirect("/superadmin");
    return res.redirect("/user"); // normal user
  } catch (err) {
    //console.log(" error : Token invalid or expired isloggedin");
    return next(); // Invalid token = treat as logged out
  }
}
module.exports=isLoggedIn;

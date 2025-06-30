const express = require('express');
const user = require("../models/user");
const bcrypt = require('bcrypt');
const createToken = require("../services/util");
const isLoggedIn = require('../middlewares/isLoggedin');

const router = express.Router();
router.get("/logout" , (req , res)=>{
    res.clearCookie("token");
    res.redirect("/");
})
router.get("/signin", isLoggedIn, (req, res) => {
  res.render("SignIn", { error: null });
});

// Signup route
router.get("/signup", isLoggedIn, (req, res) => {
  res.render("SignUp", { error: null });
});

router.post("/signup", isLoggedIn,  async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await user.findOne({ email });
    if (existingUser) {
        return res.render("SignIn", { error: "user already exist Please Sig-in" });
    }
    const USER = await user.create({
        name: name, email: email, password: password , role:role,
    })
    const token = createToken(USER);
    res.cookie("token", token);
    if (role == "admin") return res.redirect("/admin");
    else return res.redirect("/user");
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const USER = await user.findOne({ email });

    if (!USER) {
        console.log("User not found. Please Sign Up");
        return res.render("signup", { error: "User not found. Please Sign Up" });
    }
    const hashed_password = USER.password;

    try {
        const isMatched = await bcrypt.compare(password, hashed_password)
        if (!isMatched) {
            console.log("Incorrect User Name or Password.")
            return res.render("SignIn", { error: "Incorrect User Name or Password." });
        }
        const token = createToken(USER);
        res.cookie("token", token);
        if (USER.role == "admin") {
            return res.redirect("/admin");
        }
        if (USER.role == "user") {
            return res.redirect("/user");
        }
        return res.redirect("/superadmin");
    }
    catch (err) {
        console.log("Error while comparing passwords");
        return res.render("SignIn", { error: "Something went wrong. Try again." });
    }


})

module.exports = router;

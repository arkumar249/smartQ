const express = require('express');
const http=require("http");
const {initSocketIO}=require("./socket");

const app = express();
const server=http.createServer(app);
initSocketIO(server);



const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const { connectToMongoDB } = require('./connection');
const staticRoute=require("./routes/staticRoutes");
const authRoute=require("./routes/authRoute");
const userRoute=require("./routes/userRoutes");
const adminRoute=require("./routes/adminRoutes");
const superadminRoute=require("./routes/superadminRoutes");
const apiRoute=require("./routes/api");
const requireAuth=require("./middlewares/reqauth");

dotenv.config();




const PORT = 5500;

async function startServer() {
  try {
    await connectToMongoDB("mongodb://localhost:27017/project_q");
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server started at PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}

startServer();

// Middleware and View Setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.use("/" , staticRoute);
app.use("/auth" , authRoute);
app.use("/user" , userRoute);
app.use("/admin" , adminRoute);
//app.use("/superadmin" , superadminRoute);
app.use("/api"   , apiRoute);





 
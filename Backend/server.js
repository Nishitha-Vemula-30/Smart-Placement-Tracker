import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import studentRoutes from "./Routes/studentRoute.js"
import applicationRoutes from "./Routes/applicationRoutes.js"
import companyRoutes from "./Routes/companyRoutes.js"
import notificationRoutes from "./Routes/notificationRoute.js"
import authRoutes from "./Routes/authRoutes.js"
dotenv.config()
const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smart-placement-tracker-eight.vercel.app"
  ],
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use("/api/students", studentRoutes)
app.use("/api/application", applicationRoutes)
app.use("/api/company", companyRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/auth", authRoutes)
//connect to db
const connectDB=async()=>{
    try{
     await mongoose.connect(process.env.DB_URL)
     console.log("Database connection successful")
     //start http server
     app.listen(process.env.PORT,()=>{
        console.log("Server started")
     })}
     catch(err){
        console.log("Error in DB connection",err)
     }
    }
connectDB()    

//dealing with invalid path
//if none of the path is matched ,it will come here
app.use((req,res,next)=>{
   console.log(req.url)  //path is present in urlpath
   res.json({message:` ${req.url} is Invalid path`})
})

app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: "${field} ${value} already exists",
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});



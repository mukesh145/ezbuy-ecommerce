import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import connectDB from "./config/connectDB.js"

import errorMiddleWare from "./middlewares/error.js"


import productRouter from "./routers/productRouter.js"
import userRouter from "./routers/userRouter.js"
import orderRouter from "./routers/orderRouters.js"

dotenv.config({path : "Backend/config/config.env"})

const app = express()
connectDB()

app.use(express.json())
app.use(cookieParser())

app.use("/api/",productRouter)
app.use("/api/",userRouter)
app.use("/api/",orderRouter)

app.use(errorMiddleWare)

app.listen(process.env.PORT,()=>{
    console.log("Serevr running on port : "+process.env.PORT);
})
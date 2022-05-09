import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import router from './routes/routes.js'
import errorMiddleware from './middlewares/error-middleware.js'
dotenv.config()
const PORT=process.env.PORT || 5000
const app=express()
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}));
app.use("/api",router);
app.use(errorMiddleware)
const start=async ()=>{
    try{

        await mongoose.connect(process.env.DB_URL,{
           useNewUrlParser:true,
           useUnifiedTopology:true
        });
        app.listen(PORT,()=>console.log(`server started was started on ${PORT} port`))
    }
    catch (e) {
        console.log(e)
    }
}
start()

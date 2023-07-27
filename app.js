import dotenv from "dotenv"
dotenv.config({path:"routes/.env"})
import express from "express"
import cors from 'cors'
import connectDB from "./config/connectDB.js"
import userRoutes from "./routes/userRoutes.js"

const DATABASE_URL=process.env.DATABASE_URL


const app=express()
//cors Policy
app.use(cors())

//for making json
app.use(express.json())


//Exporting route

app.use("/api/v1",userRoutes)


//Connect Datbase
connectDB(DATABASE_URL)


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on :http://localhost:${process.env.PORT}`)
})

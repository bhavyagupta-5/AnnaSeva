import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
dotenv.config()
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000
app.listen(process.env.PORT , ()=>{
    console.log(`server is running on ${PORT}`)
})


mongoose.connect(process.env.MONGO_URI, {
}).then(console.log("MongoDB Connected"))
.catch((err) => console.error("Error occured: ", err));

app.use('/api/users', userRoutes);
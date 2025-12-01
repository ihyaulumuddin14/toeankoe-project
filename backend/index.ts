import mongoose from "mongoose"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "./routes/route.js"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use("/api/v1", router)
app.disable("x-powered-by")
dotenv.config()

const MONGO_URI = process.env.MONGO_URI
const PORT = parseInt(process.env.PORT!)

mongoose
  .connect(MONGO_URI!)
  .then(() => {
    console.log("Connected to MongoDB Atlas")

    app.listen(PORT, "0.0.0.0", () => console.log("Server running at port ", PORT))
  })
  .catch((error) => {
    console.log(error)
    mongoose.connection.close()
  })
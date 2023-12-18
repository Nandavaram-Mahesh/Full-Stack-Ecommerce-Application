import dotenv from "dotenv";
import { httpServer } from "./app.js";
import connectDB from "./db/index.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config({
    path: "./.env"
})


const startServer = () => {
    httpServer.listen(process.env.PORT || 8080, () => {
        console.log(`Listening to port:${process.env.PORT}`)
        
    })
}

(async () => {
    try {
        await connectDB()
        startServer()
    } catch (error) {
        console.log("Mongo db connect error: ", err);
    }
})()



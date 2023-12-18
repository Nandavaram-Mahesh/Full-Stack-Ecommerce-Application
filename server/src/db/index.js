import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export let dbInstance = undefined

const connectDB = async()=>{
    try{

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        dbInstance = connectionInstance
        
        console.log(
            `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
        );
        // The host typically represents the hostname or IP address of the server where the database is hosted
    } 
    catch(error){
        console.log("MongoDB connection error: ",error)
        new ApiError(400,"Testing Api Error Class",error)
        process.exit(1)
    }

}

export default connectDB
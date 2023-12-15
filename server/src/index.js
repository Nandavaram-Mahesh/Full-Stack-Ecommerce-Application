import  dotenv  from "dotenv";
import {httpServer}  from "./app.js";
import connectDB from "./db/index.js";

/**
 
dotenv.config() Method:

The dotenv.config() method is used to load the variables from the .env file into the application's environment.
The path option specifies the path to the .env file.
In this case, it's set to "./.env", indicating that the .env file is located in the root directory 
of the project. 


*/

dotenv.config({
    path: "./.env"
})

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const startServer = () => {
    httpServer.listen(process.env.PORT || 8080, () => {
        console.log(`Listening to port:${process.env.PORT}`)
    })
}


if (majorNodeVersion >= 14) {
    try {
        await connectDB()
        startServer()
    } catch (error) {
        console.log("Mongo db connect error: ", err);
    }
} else {
    connectDB()
    .then(() => {
        startServer()
    })
    .catch((error) => {
        console.log("Mongo db connect error: ", err);
    })
}
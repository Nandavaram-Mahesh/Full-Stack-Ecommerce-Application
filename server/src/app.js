import { createServer } from "http";
import express, { urlencoded } from "express";
import { rateLimit } from 'express-rate-limit'
import cors from "cors";
import { ApiError } from "./utils/ApiError";
import userRouter from './routes/user.routes.js'
const app = express()
const httpServer = createServer(app)  


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	handler:(_,__,___,options)=>{
        throw new ApiError(options.statusCode || 500,`There are too many requests. You are only allowed ${
            options.max
          } requests per ${options.windowMs / 60000} minutes`)
    }
    // store: ... , // Use an external store for consistency across multiple server instances.
})

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")); // configure static file to save images locally
app.use(
    cors({
        origin: process.env.CORS_ORIGIN, /**Telling the sever to accept requests from this origin*/
        credentials: true,   
        /** credentials: true :-  Indicates whether the browser should include credentials (like cookies) when making the actual request. 
        Set to true to pass the header, otherwise it is omitted */                       
    })
);

//  Routes

app.use("/api/v1/users",userRouter)




export { httpServer }
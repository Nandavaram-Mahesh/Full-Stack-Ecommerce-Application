import { createServer } from "http";
import express from "express";
import cors from "cors";

const app = express()
const httpServer = createServer(app)

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);



export { httpServer }
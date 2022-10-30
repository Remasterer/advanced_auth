import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import router from "./routes/index.js";
import {errorMiddleware} from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/v1', router);

app.use(errorMiddleware);

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.m3d5g.mongodb.net/?retryWrites=true&w=majority`).finally(() => {
    app.listen(4000, () => console.log('Server started on port 4000'));
});


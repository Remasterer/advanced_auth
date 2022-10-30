import express from "express";
import authRoutes from './authRoutes/index.js';

const { Router } = express;

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);

export default rootRouter;
import express from "express";
import * as authController from '../../controllers/authController.js';
import {validate} from "../validationMiddleware.js";
import { defaultAuthValidations, registerValidation } from "./validation.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";

const { Router } = express;

const router = Router();

router.post('/register', validate(registerValidation), authController.registerUser);
router.post('/login', validate(defaultAuthValidations), authController.login);
router.post('/logout', authController.logout);
router.get('/activate/:link', authController.activateToken);
router.post('/refresh', authController.refreshSession);
router.get('/users', authMiddleware ,authController.getUsers);

export default router;
// BE-75: authRouter — /api/v1/auth routes

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middlewares/validateBody';
import { RegisterDto } from '../../application/dtos/auth/RegisterDto';
import { LoginDto } from '../../application/dtos/auth/LoginDto';

export const authRouter = Router();

// POST /api/v1/auth/register
authRouter.post('/register', validateBody(RegisterDto), AuthController.register);

// POST /api/v1/auth/login
authRouter.post('/login', validateBody(LoginDto), AuthController.login);

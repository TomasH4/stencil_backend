// BE-71: AuthController — handles registration and login

import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { RegisterDtoType } from '../../application/dtos/auth/RegisterDto';
import { LoginDtoType } from '../../application/dtos/auth/LoginDto';

// Instantiate repositories and use cases (simple composition root)
const userRepo = new UserRepository();
const registerUseCase = new RegisterUseCase(userRepo);
const loginUseCase = new LoginUseCase(userRepo);

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await registerUseCase.execute(req.body as RegisterDtoType);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await loginUseCase.execute(req.body as LoginDtoType);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
};

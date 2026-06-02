// BE-52: LoginUseCase — authenticate a user and return a JWT

import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { LoginDtoType } from '../../dtos/auth/LoginDto';
import { AppError } from '../../../shared/errors/AppError';
import { generateToken } from '../../../shared/utils/jwt';
import { Role } from '../../../domain/entities/User';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: LoginDtoType): Promise<LoginResult> {
    // Find user by email
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare provided password against stored hash
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate signed JWT
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}

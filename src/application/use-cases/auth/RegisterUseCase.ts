// BE-51: RegisterUseCase — create a new user account

import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RegisterDtoType } from '../../dtos/auth/RegisterDto';
import { AppError } from '../../../shared/errors/AppError';
import { Role } from '../../../domain/entities/User';

export interface RegisterResult {
  id: string;
  email: string;
  role: Role;
}

export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: RegisterDtoType): Promise<RegisterResult> {
    // Check if email is already taken
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role as Role,
    });

    return { id: user.id, email: user.email, role: user.role };
  }
}

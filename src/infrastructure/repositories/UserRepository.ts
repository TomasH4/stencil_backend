// BE-39: UserRepository — Prisma implementation of IUserRepository

import { prisma } from '../database/prisma.client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, CreateUserData, UpdateUserData, Role } from '../../domain/entities/User';
import { AppError } from '../../shared/errors/AppError';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          role: data.role,
        },
      });
      return this.mapToEntity(user);
    } catch (error: unknown) {
      // Prisma unique constraint violation
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new AppError('Email already in use', 409);
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  private mapToEntity(raw: {
    id: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: raw.id,
      email: raw.email,
      password: raw.password,
      role: raw.role as Role,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}

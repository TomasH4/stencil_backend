// BE-27: User entity — domain layer
// Mirrors the Prisma User model but is framework-agnostic

export enum Role {
  CLIENT = 'CLIENT',
  TATTOO_ARTIST = 'TATTOO_ARTIST',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

/** Used when creating a new user (password is already hashed) */
export interface CreateUserData {
  email: string;
  password: string;
  role: Role;
}

/** Used when updating a user */
export type UpdateUserData = Partial<Omit<CreateUserData, 'email'>>;

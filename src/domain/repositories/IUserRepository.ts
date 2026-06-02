// BE-31: IUserRepository — domain layer interface
// All repository implementations in infrastructure/ must implement this contract

import { User, CreateUserData, UpdateUserData } from '../entities/User';

export interface IUserRepository {
  /**
   * Find a user by their unique ID.
   * Returns null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by their email address.
   * Returns null if not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create and persist a new user.
   * Throws if email already exists.
   */
  create(data: CreateUserData): Promise<User>;

  /**
   * Update an existing user by ID.
   * Returns the updated user.
   */
  update(id: string, data: UpdateUserData): Promise<User>;

  /**
   * Delete a user by ID.
   */
  delete(id: string): Promise<void>;
}

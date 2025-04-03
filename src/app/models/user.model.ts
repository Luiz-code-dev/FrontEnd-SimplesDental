export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
}

export interface UserContext {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user?: UserContext;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

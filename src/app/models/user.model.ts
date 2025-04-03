export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserContext {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
  active: boolean;
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
  active: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}

export interface AuthResponse {
  token: string;
  user: UserContext;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

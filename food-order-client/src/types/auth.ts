export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'Customer' | 'Admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

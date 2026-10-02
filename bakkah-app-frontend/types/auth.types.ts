export type UserRole = 'user' | 'admin';

export interface SignUpFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface VerifyOtpData {
  email: string;
  token: string;
  role: UserRole;
  username: string;
  phone: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}
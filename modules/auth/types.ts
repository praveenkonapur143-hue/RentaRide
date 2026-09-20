export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  user: AuthenticatedUser;
  token: string;
}

export interface User {
  uid: string;
  email: string;
  password?: string;
  displayName?: string;
  ipAddress?: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  canAccessTodos?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

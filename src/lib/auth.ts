export interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  fullName: string;
  address: string;
  role: 'admin' | 'user';
  balance: number;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  fullName: string;
  address: string;
  role: 'admin' | 'user';
  balance: number;
}

// Simple password hashing (in production, use proper bcrypt)
export const hashPassword = (password: string): string => {
  return btoa(password + 'luxury_service_salt');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const setCurrentUser = (user: AuthUser) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): AuthUser | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const requireAuth = (): AuthUser => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireAdmin = (): AuthUser => {
  const user = requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
};
import { useState, useCallback } from 'react';
import type { User } from '../types';

const STORAGE_KEY = 'grh_users';
const SESSION_KEY = 'grh_session';

export const useAuth = () => {
  const getUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const register = useCallback((userData: Omit<User, 'id' | 'role'>): { success: boolean; error?: string } => {
    const users = getUsers();
    const exists = users.find(u => u.email === userData.email);
    if (exists) return { success: false, error: 'Cet email est déjà utilisé.' };
    const newUser: User = { ...userData, id: Date.now().toString(), role: 'employee' };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { success: true };
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Email ou mot de passe incorrect.' };
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return { currentUser, login, logout, register };
};
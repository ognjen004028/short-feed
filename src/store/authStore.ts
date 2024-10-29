import { create } from 'zustand';
import { auth, User } from '../lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  signIn: async (username, password) => {
    set({ isLoading: true });
    try {
      const user = await auth.signIn(username, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  signUp: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const user = await auth.signUp(username, email, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  signOut: () => {
    set({ user: null });
  },
}));
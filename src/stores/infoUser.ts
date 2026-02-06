import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
  isVerified?: boolean;
  gender?: string;
  website?: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (newUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newUser } : (newUser as User),
        })),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-store" },
  ),
);

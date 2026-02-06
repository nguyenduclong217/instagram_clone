import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RegisterState {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: null }),
    }),
    {
      name: "register-email", // localStorage key
    },
  ),
);

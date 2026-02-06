import { create } from "zustand";

interface ResendState {
  cooldown: number; // số giây còn lại
  isDisabled: boolean;
  startCooldown: (seconds?: number) => void;
  tick: () => void;
  reset: () => void;
}

export const useResendStore = create<ResendState>((set, get) => ({
  cooldown: 0,
  isDisabled: false,

  startCooldown: (seconds = 20) => {
    set({ cooldown: seconds, isDisabled: true });
  },

  tick: () => {
    const { cooldown } = get();
    if (cooldown <= 1) {
      set({ cooldown: 0, isDisabled: false });
    } else {
      set({ cooldown: cooldown - 1 });
    }
  },

  reset: () => set({ cooldown: 0, isDisabled: false }),
}));

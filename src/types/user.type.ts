import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InfoResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface InfoUser {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  profilePicture: string | null;
  bio: string | null;
  website: string | null;
  gender: "male" | "female" | "other" | null;
  isVerified: boolean;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

type AuthState = {
  user: InfoUser | null;
  setUser: (user: InfoUser | Partial<InfoUser>) => void;
  clearUser: () => void;
};

export const userAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser) =>
        set((state) => {
          if (!state.user) {
            // lần đầu login → phải là full User
            return { user: newUser as InfoUser };
          }

          // các lần update → merge partial
          return {
            user: { ...state.user, ...newUser },
          };
        }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-store" },
  ),
);

// follower

export interface FollowerUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  bio: string;
}

export interface FollowersData {
  followers: FollowerUser[];
}
export interface FollowingData {
  following: FollowerUser[];
}

export interface DeleteAvatarResponse {
  success: boolean;
  message: string;
  data: null;
}

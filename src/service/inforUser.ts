import instance from "@/pages/utils/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
// User Info

export const profileUser = async (accessToken: string) => {
  try {
    const response = await instance.get(`/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response) {
      return;
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Edit profile

export const updateProfile = async (
  formData: FormData,
  accessToken: string,
) => {
  return instance.patch("/api/users/profile", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Remove Avt
export const removeAvt = async (accessToken: string) => {
  return instance.delete(`/api/users/profile/picture`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// List user

export const listUser = async (accessToken: string) => {
  try {
    const res = await instance.get("/api/users/suggested?limit=4", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// Follower

export const follower = async (userId: string) => {
  try {
    const response = await instance.get(`/api/follow/${userId}/followers`,)
    if (!response) {
      return;
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Following
export const following = async (userId: string) => {
  try {
    const response = await instance.get(`/api/follow/${userId}/following`,)
    if (!response) {
      return;
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
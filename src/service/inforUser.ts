import instance from "@/pages/utils/axios";
import type {
  DeleteAvatarResponse,
  FollowersData,
  FollowingData,
  InfoResponse,
  InfoUser,
} from "@/types/user.type";

// User Info

export const profileUser = async (accessToken: string): Promise<InfoUser> => {
  const res = await instance.get<InfoResponse<InfoUser>>("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data;
};

// Edit profile

export const updateProfile = async (
  formData: FormData,
  accessToken: string,
): Promise<InfoUser> => {
  const res = await instance.patch<InfoResponse<InfoUser>>(
    "/api/users/profile",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data.data;
};

// Remove Avt
export const removeAvt = async (
  accessToken: string,
): Promise<DeleteAvatarResponse> => {
  const res = await instance.delete<DeleteAvatarResponse>(
    "/api/users/profile/picture",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
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

export const follower = async (userId: string): Promise<FollowersData> => {
  const response = await instance.get<InfoResponse<FollowersData>>(
    `/api/follow/${userId}/followers`,
  );
  return response.data.data;
};

// Following

export const following = async (userId: string): Promise<FollowingData> => {
  const response = await instance.get<InfoResponse<FollowingData>>(
    `/api/follow/${userId}/following`,
  );
  return response.data.data;
};

// export const following = async (userId: string) => {
//   try {
//     const response = await instance.get(`/api/follow/${userId}/following`);
//     if (!response) {
//       return;
//     }
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// infoUser follow _id

export const infoUserId = async (userId: string): Promise<InfoUser> => {
  const res = await instance.get<InfoResponse<InfoUser>>(
    `/api/users/${userId}`,
  );
  return res.data.data;
};

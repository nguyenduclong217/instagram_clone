import instance from "@/pages/utils/axios";

// Follow user
export const followUser = async (
  accessToken: string,
  userId: string,
): Promise<void> => {
  await instance.post(
    `/api/follow/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const unFollowUser = async (
  accessToken: string,
  userId: string,
): Promise<void> => {
  await instance.delete(`/api/follow/${userId}/follow`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// unfollow user

// export const unFollowUser = async (accessToken: string, userId: string) => {
//   try {
//     const response = await instance.delete(`/api/follow/${userId}/follow`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const data = response.data;
//     return data;
//   } catch (error) {
//     console.error("listUser error:", error);
//     throw error;
//   }
// };

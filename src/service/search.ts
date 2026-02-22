import instance from "@/pages/utils/axios";
import {
  type SearchHistory,
  type SearchHistoryItem,
  type AddSearchHistoryResponse,
  type GetSearchHistoryResponse,
  type SearchUser,
  type SearchUserResponse,
} from "@/types/search";

// search user
export const searchUser = async (q: string): Promise<SearchUser[]> => {
  try {
    const response = await instance.get<SearchUserResponse>(
      `/api/users/search?q=${q}`,
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Search History

export const addSearchHistory = async (
  accessToken: string,
  searchedUserId: string,
  searchQuery: string,
): Promise<SearchHistory> => {
  const { data } = await instance.post<AddSearchHistoryResponse>(
    "/api/search-history",
    {
      searchedUserId,
      searchQuery,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

// Get Search History

export const getSearchHistory = async (): Promise<SearchHistoryItem[]> => {
  const response =
    await instance.get<GetSearchHistoryResponse>(`/api/search-history`);

  return response.data.data;
};

// Delete User Search

export const deleteSearch = async (
  accessToken: string,
  historyId: string,
): Promise<void> => {
  await instance.delete(`/api/search-history/${historyId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// delete all

export const deleteAllSearch = async (accessToken: string): Promise<void> => {
  await instance.delete(`/api/search-history`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// export const  = async (accessToken: string) => {
//   try {
//     const response = await instance.delete(`/api/search-history`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.log("deleteSearch error:", error);
//     throw error;
//   }
// };

import instance from "@/pages/utils/axios";

// search user
export const searchUser = async (q: string) => {
  try {
    const response = await instance.get(`/api/users/search?q=${q}`);
    return response.data;
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
) => {
  const res = await instance.post(
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

  return res.data;
};

// Get Search History

export const getSearchHistory = async () => {
  try {
    const response = await instance.get(`/api/search-history`, {});
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Delete User Search

export const deleteSearch = async (accessToken: string, historyId: string) => {
  try {
    const response = await instance.delete(`/api/search-history/${historyId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("deleteSearch error:", error);
    throw error;
  }
};

// delete all

export const deleteAllSearch = async (accessToken: string) => {
  try {
    const response = await instance.delete(`/api/search-history`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("deleteSearch error:", error);
    throw error;
  }
};

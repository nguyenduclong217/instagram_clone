import instance from "@/pages/utils/axios";

export const listPost = async () => {
  try {
    const res = await instance.get("/api/posts/explore?limit=9");
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// explore
export const explorePost = async () => {
  try {
    const res = await instance.get("/api/posts/explore");
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

//User posts

export const userPost = async (userId: string) => {
  try {
    const res = await instance.get(`/api/posts/user/${userId}`);
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// postDetail

export const postDetail = async (postId: string) => {
  try {
    const res = await instance.get(`/api/posts/${postId}`);
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// Create post

export const createPost = async (accessToken: string, formData: FormData) => {
  return instance.post(`/api/posts`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// New post

export const newPost = async () => {
  try {
    const res = await instance.get("/api/posts/feed?limit=9");
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// Edit caption post

export const editCaptionPost = async (
  accessToken: string,
  postId: string,
  caption: string,
) => {
  return instance.patch(
    `/api/posts/${postId}`,
    { caption },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// Delete post

export const deletePost = async (accessToken: string, postId: string) => {
  return instance.delete(`/api/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Like post

export const likePost = async (accessToken: string, postId: string) => {
  return instance.post(`/api/posts/${postId}/like`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};


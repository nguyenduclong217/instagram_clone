// Create comment

import instance from "@/pages/utils/axios";

export const createComment = (
  accessToken: string,
  postId: string,
  content: string,
  parentCommentId: string | null = null,
) => {
  return instance.post(
    `/api/posts/${postId}/comments`,
    {
      content,
      parentCommentId,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

// List Reply Comment postDetail

export const listReplyPost = async (postId: string, commentId: string) => {
  try {
    const res = await instance.get(
      `/api/posts/${postId}/comments/${commentId}/replies`,
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// Reply comment

export const replyComment = async (
  accessToken: string,
  postId: string,
  content: string,
  commentId: string,
) => {
  try {
    const response = await instance.post(
      `/api/posts/${postId}/comments/${commentId}/replies`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    // handleAxiosError(error);
  }
};

// Chinh sua binh luan

export const editComment = async (
  accessToken: string,
  postId: string,
  content: string,
  commentId: string,
) => {
  try {
    const response = await instance.patch(
      `/api/posts/${postId}/comments/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// Delete comment

export const deleteComment = async (
  accessToken: string,
  postId: string,
  commentId: string,
) => {
  try {
    const response = await instance.delete(
      `/api/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

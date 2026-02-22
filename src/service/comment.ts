// Create comment

import instance from "@/pages/utils/axios";
import type {
  ApiResponse,
  CreateComment,
  PostComment,
  ReplyApi,
  ReplyResponse,
} from "@/types/post.type";

export const createComment = async (
  accessToken: string,
  postId: string,
  content: string,
  parentCommentId: string | null = null,
): Promise<CreateComment> => {
  const res = await instance.post<{ data: CreateComment }>(
    `/api/posts/${postId}/comments`,
    {
      content,
      parentCommentId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data.data;
};

// List Reply Comment postDetail

export const listReplyPost = async (
  postId: string,
  commentId: string,
): Promise<ReplyApi[]> => {
  try {
    const res = await instance.get<ApiResponse<{ replies: ReplyApi[] }>>(
      `/api/posts/${postId}/comments/${commentId}/replies`,
    );
    return res.data.data.replies;
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
): Promise<ReplyApi> => {
  const response = await instance.post<ReplyResponse<ReplyApi>>(
    `/api/posts/${postId}/comments/${commentId}/replies`,
    { content },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data.data;
};

// Chinh sua binh luan

export const editComment = async (
  accessToken: string,
  postId: string,
  content: string,
  commentId: string,
) => {
  try {
    const response = await instance.patch<ApiResponse<PostComment>>(
      `/api/posts/${postId}/comments/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// Delete comment

type DeleteComment = {
  _id: string;
};

export const deleteComment = async (
  accessToken: string,
  postId: string,
  commentId: string,
): Promise<DeleteComment> => {
  const response = await instance.delete<ApiResponse<DeleteComment>>(
    `/api/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data.data;
};

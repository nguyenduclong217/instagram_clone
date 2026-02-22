import instance from "@/pages/utils/axios";
import {
  PostDetail,
  type ExploreResponse,
  type LikePostResponse,
  type Post,
  type ReplyResponse,
} from "@/types/post.type";

export const getExplorePosts = async (
  offset: number,
  limit: number,
): Promise<ExploreResponse> => {
  try {
    const res = await instance.get<ExploreResponse>("/api/posts/feed", {
      params: {
        offset,
        limit,
      },
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error("listUser error:", error);
    throw error;
  }
};

// explore
export const explorePost = async (): Promise<ExploreResponse> => {
  try {
    const res = await instance.get<ExploreResponse>("/api/posts/explore");
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

export const postDetail = async (postId: string): Promise<PostDetail> => {
  try {
    const res = await instance.get<PostDetail>(`/api/posts/${postId}`);
    return res.data.data;
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

// export const newPost = async () => {
//   try {
//     const res = await instance.get("/api/posts/feed?limit=9");
//     const data = res.data;
//     return data;
//   } catch (error) {
//     console.error("listUser error:", error);
//     throw error;
//   }
// };

// Edit caption post

export const editCaptionPost = async (
  accessToken: string,
  postId: string,
  caption: string,
): Promise<Post> => {
  const res = await instance.patch<ReplyResponse<Post>>(
    `/api/posts/${postId}`,
    { caption },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data.data;
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

export const likePost = async (
  accessToken: string,
  postId: string,
): Promise<LikePostResponse> => {
  const res = await instance.post<{ data: LikePostResponse }>(
    `/api/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data.data;
};

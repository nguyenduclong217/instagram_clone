export type MediaType = "image" | "video";

export interface PostBase {
  _id: string;
  caption: string;
  image?: string;
  video?: string | null;
  mediaType: MediaType;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  userId: ExploreUser;
  profilePicture: string;
}
export interface ExplorePost extends PostBase {
  comments: number;
  engagementScore: number;
}

export interface ExploreUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

export interface ExploreResponse {
  success: boolean;
  message: string;
  data: {
    posts: ExplorePost[];
    pagination: Pagination;
  };
}

export interface LikePostResponse {
  _id: string;
  likes: number;
}

// postDetail
export interface PostComment {
  _id: string;
  content: string;
  user: ExploreUser;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface PostDetail extends Omit<PostBase, never> {
  comments: PostComment[];
}

// comment
export interface CreateComment {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  content: string;
  parentCommentId: string | null;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

export const mapCreateCommentToPostComment = (
  c: CreateComment,
): PostComment => ({
  _id: c._id,
  content: c.content,
  createdAt: c.createdAt,
  likes: c.likes,
  isLiked: c.isLiked,
  user: {
    _id: c.userId._id,
    username: c.userId.username,
    profilePicture: c.userId.profilePicture,
    fullName: "",
  },
});

export interface ReplyUser {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface ReplyApi {
  _id: string;
  postId: string;
  userId: ReplyUser;
  content: string;
  parentCommentId: string | null;
  likes: number;
  createdAt: string;
}

// export const mapReplyToPostComment = (r: ReplyApi): PostComment => ({
//   _id: r._id,
//   content: r.content,
//   createdAt: r.createdAt,
//   likes: r.likes,
//   user: {
//     _id: r.userId._id,
//     username: r.userId.username,
//     profilePicture: r.userId.profilePicture,
//     fullName: "",
//   },
// });

export interface ReplyResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type UpdateCommentVars = {
  postId: string;
  commentId: string;
  content: string;
};

export interface Post {
  _id: string;
  caption: string;
  image: string;
  updatedAt: string;
}

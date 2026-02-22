import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { likePost } from "@/service/postServices";
import { ExploreResponse, PostDetail } from "@/types/post.type";

export const LikePost = (LIMIT: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => {
      const token = localStorage.getItem("access_token");
      return likePost(token!, postId);
    },

    onSuccess: (data, postId) => {
      // 1️⃣ Update post detail
      queryClient.setQueryData<PostDetail>(
        ["postDetail", postId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            likes: data.likes,
            isLiked: data.isLiked,
          };
        },
      );

      // 2️⃣ Update explore infinite query
      queryClient.setQueryData<InfiniteData<ExploreResponse>>(
        ["explorePosts", LIMIT],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        likes: data.likes,
                        isLiked: !post.isLiked,
                      }
                    : post,
                ),
              },
            })),
          };
        },
      );
    },
  });
};

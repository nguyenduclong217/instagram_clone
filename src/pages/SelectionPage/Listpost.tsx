import { useEffect, useState } from "react";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  ArrowRightLeft,
  Send,
  Bookmark,
} from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  deletePost,
  editCaptionPost,
  getExplorePosts,
} from "@/service/postServices";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { type ExploreResponse } from "@/types/post.type";
import PostDetailContent from "./PostDetailContent";
import { LikePost } from "./LikePost";
import { userAuthStore } from "@/types/user.type";
dayjs.extend(relativeTime);
dayjs.locale("vi");
export default function Listpost() {
  const navigate = useNavigate();
  const LIMIT = 9;
  const [postId, setPostId] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0 });

  const likeMutation = LikePost(LIMIT);

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["explorePosts", LIMIT],

      // offset bắt đầu = 0
      initialPageParam: 0,

      queryFn: ({ pageParam }) => getExplorePosts(pageParam, LIMIT),

      getNextPageParam: (lastPage, allPages) => {
        // if (!lastPage.data.pagination.hasMore) return undefined;

        const totalLoadedPosts = allPages.reduce(
          (sum, page) => sum + page.data.posts.length,
          0,
        );

        return totalLoadedPosts;
      },
    });

  useEffect(() => {
    if (status === "success") {
      console.log(data);
    }
  }, [status, data]);

  type DialogMode = "menu" | "edit";

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>("menu");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  // edit comment

  const [caption, setCaption] = useState("");
  // const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Edit post
  const editCaptionMutation = useMutation({
    mutationFn: ({ postId, caption }: { postId: string; caption: string }) => {
      const token = localStorage.getItem("access_token");
      return editCaptionPost(token!, postId, caption);
    },

    onSuccess: (updatedPost, { postId }) => {
      toast.success("Sửa thành công 🎉");

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
                        caption: updatedPost.caption,
                      }
                    : post,
                ),
              },
            })),
          };
        },
      );

      setOpen(false);
      setMode("menu");
      setActivePostId(null);
    },

    onError: () => {
      toast.error("Sửa thất bại");
    },
  });

  // Xoa post

  const handleDelete = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken === null || accessToken.trim() === "" || postId === null)
      return;

    try {
      await deletePost(accessToken, postId);

      toast.success("Xóa bài viết thành công");

      void queryClient.invalidateQueries({
        queryKey: ["explorePosts", LIMIT],
      });

      setOpen(false);
      setActivePostId(null);
      setPostId(null);
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage(); // co tinh khong await
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const user = userAuthStore((s) => s.user);

  return (
    <div>
      {data?.pages
        .flatMap((page) => page.data.posts)
        .filter((post) => post.userId !== null)
        .map((item) => (
          <div
            key={item._id}
            className="w-[550px] mx-auto bg-white border border-gray-200 rounded-xl shadow-sm mt-12 p-2"
          >
            {/* Name User Post */}
            <div className="flex items-center px-3 justify-between">
              {/* Avatar user */}
              <div className="flex items-center cursor-pointer">
                <img
                  onClick={() => void navigate(`/users/${item.userId._id}`)}
                  src={
                    item.image != null && item.image.trim() !== ""
                      ? `https://instagram.f8team.dev${item.image}`
                      : `data:image/png;base64,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`
                  }
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <h1 className="ml-3 font-semibold text-sm">
                  {item.userId.username} -
                  <span className="text-gray-400 font-normal">
                    {dayjs(item.createdAt).fromNow()}
                  </span>
                </h1>
              </div>

              <div>
                <Dialog
                  open={open && activePostId === item._id}
                  onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                      setMode("menu");
                      setActivePostId(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActivePostId(item._id);
                        setMode("menu");
                        setOpen(true);
                        setPostId(item._id);
                      }}
                      className="cursor-pointer"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="w-100">
                    {mode === "menu" && (
                      <div className="flex flex-col divide-y">
                        <button className="text-red-600 py-3  cursor-pointer">
                          Report
                        </button>
                        <button className="text-red-600 py-3  cursor-pointer">
                          Unfollow
                        </button>

                        {user?._id === item.userId._id && (
                          <>
                            <button
                              className="py-3  cursor-pointer"
                              onClick={() => setMode("edit")}
                            >
                              Edit caption
                            </button>
                            <button
                              className="py-3"
                              onClick={() => (handleDelete(), setOpen(false))}
                            >
                              Delete post
                            </button>
                          </>
                        )}

                        <button className="py-3  cursor-pointer">
                          Add to favorites
                        </button>

                        <button
                          className="py-3  cursor-pointer"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {mode === "edit" && (
                      <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-center cursor-pointer">
                          Edit caption
                        </h2>

                        <textarea
                          defaultValue={item.caption}
                          onChange={(e) => setCaption(e.target.value)}
                          className="w-full border p-2"
                        />

                        <div className="flex justify-end gap-2 cursor-pointer">
                          <Button
                            variant="ghost"
                            onClick={() => setMode("menu")}
                          >
                            Back
                          </Button>

                          <Button
                            onClick={() => {
                              // gọi API update caption
                              setOpen(false);
                              setMode("menu");

                              setActivePostId(null);
                              editCaptionMutation.mutate({
                                postId: activePostId!,
                                caption,
                              });
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Img post */}
            {item.mediaType === "image" && item.image != null && (
              <img
                src={`https://instagram.f8team.dev${item.image}`}
                alt="post"
                className="w-[500px] mx-auto mt-5 "
              />
            )}

            {item.mediaType === "video" && item.video != null && (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-[300px] mx-auto mt-10 "
                src={`https://instagram.f8team.dev${item.video}`}
              />
            )}
            <div>
              <div className="flex gap-3 mt-4 px-3 justify-between">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Heart
                      className={`transition-transform duration-200 group-hover:scale-110 cursor-pointer ${
                        item.isLiked
                          ? "text-red-500 fill-red-500"
                          : "text-black"
                      }`}
                      onClick={() => likeMutation.mutate(item._id)}
                      size={20}
                    />

                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="flex items-center gap-1 cursor-pointer group"
                          onClick={() => setPostId(item._id)}
                        >
                          <MessageCircle
                            className="transition-transform duration-200 group-hover:scale-110"
                            size={20}
                          />
                          <span>{item.comments}</span> .
                        </button>
                      </DialogTrigger>
                      {/* <PostDetailContent postId={postID}/> */}
                      <PostDetailContent postId={postId} />
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <ArrowRightLeft
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                    <span>19</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Send
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Bookmark
                    className="transition-transform duration-200 group-hover:scale-110"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <h1 className="px-3">{item.caption}</h1>
          </div>
        ))}
      <div ref={ref} className="h-10" />

      {isFetchingNextPage && (
        <p className="text-center py-4">Loading more...</p>
      )}
    </div>
  );
}

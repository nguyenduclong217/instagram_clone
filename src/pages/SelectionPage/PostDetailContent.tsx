import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ReplyComment from "./ReplyComment";
import {
  Heart,
  MessageCircle,
  ArrowRightLeft,
  Send,
  Bookmark,
  Annoyed,
  MoreHorizontal,
  Ellipsis,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  ExploreResponse,
  PostDetail,
  ReplyApi,
  type PostComment,
  type UpdateCommentVars,
} from "@/types/post.type";
import {
  mapCreateCommentToPostComment,
  // type PostDetail,
} from "@/types/post.type";
import { userAuthStore } from "@/types/user.type";
import { useState } from "react";
import { LikePost } from "./LikePost";
import {
  createComment,
  deleteComment,
  editComment,
  replyComment,
} from "@/service/comment";
import { postDetail } from "@/service/postServices";

interface Props {
  postId: string;
}

export default function PostDetailContent({ postId }: Props) {
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState<null | {
    commentId: string;
    content: string;
  }>(null);
  // const [postId, setPostId] = useState<string | null>(null);
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<null | {
    commentId: string;
    username: string;
  }>(null);

  const LIMIT = 9;

  const likeMutation = LikePost(LIMIT);
  const id = userAuthStore((s) => s.user?._id);

  const { data, isLoading } = useQuery<
    PostDetail,
    unknown,
    PostDetail,
    [string, string | null]
  >({
    queryKey: ["postDetail", postId],
    enabled: typeof postId === "string",
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      if (id === null) {
        throw new Error("postId is null");
      }
      return postDetail(id);
    },
  });

  // Add Comment

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => {
      const token = localStorage.getItem("access_token")!;
      return createComment(token, postId, content);
    },
    onSuccess: (res, { postId }) => {
      toast.success("Đã thêm comment");
      const newComment = mapCreateCommentToPostComment(res);

      queryClient.setQueryData<PostDetail>(["postDetail", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: [newComment, ...old.comments],
        };
      });
      //update số comment ngoài list post

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
                        comments: post.comments + 1,
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

  // deleteComment

  const deleteCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken === null) {
        throw new Error("No access token");
      }
      return deleteComment(accessToken, postId, commentId);
    },

    onSuccess: (_, { postId, commentId }) => {
      toast.success("Xóa comment thành công");

      // Cập nhật list comment realtime
      queryClient.setQueryData<PostDetail>(["postDetail", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.filter((c) => c._id !== commentId),
        };
      });

      // Giảm số comment ngoài post list
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
                        comments: post.comments - 1,
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

  console.log(data);
  // Edit comment

  const updateCommentMutation = useMutation<
    PostComment,
    Error,
    UpdateCommentVars
  >({
    mutationFn: ({ postId, commentId, content }) => {
      const token = localStorage.getItem("access_token")!;
      return editComment(token, postId, content, commentId);
    },

    onSuccess: (updatedComment, { postId, commentId }) => {
      toast.success("Đã cập nhật comment");

      queryClient.setQueryData<PostDetail>(["postDetail", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.map((c) =>
            c._id === commentId ? { ...c, content: updatedComment.content } : c,
          ),
        };
      });
    },
  });
  // Reply comment
  const replyMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      content,
    }: {
      postId: string;
      commentId: string;
      content: string;
    }) => {
      const token = localStorage.getItem("access_token");
      return replyComment(token!, postId, content, commentId);
    },

    onSuccess: (data, variables) => {
      toast.success("Đã thêm reply 💬");

      queryClient.setQueryData<ReplyApi[]>(
        ["replyComment", variables.postId, variables.commentId],
        (old = []) => [data, ...old],
      );

      setOpenReplyFor(variables.commentId);
    },
  });
  // if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  return (
    <DialogContent className="w-[70%] h-[85%] flex items-centeroverflow-hidden">
      <div className="flex w-full max-w-[100%] h-[100%] bg-white rounded-2xl overflow-hidden">
        <div className="w-[50%] h-[80%] my-auto">
          {data.mediaType === "image" && data.image != null && (
            <img
              src={`https://instagram.f8team.dev${data.image}`}
              alt="post"
              className="w-full h-full object-cover"
            />
          )}

          {data.mediaType === "video" && data.video != null && (
            <video
              src={`https://instagram.f8team.dev${data.video}`}
              controls
              className="w-[100%] h-[100%] my-auto"
            />
          )}
        </div>

        <div className="w-[50%] h-[100%] flex flex-col h-full bg-white px-2">
          <div className="flex items-center px-3 justify-between border-b border-b-gray-500">
            {/* Avatar user */}
            <div className="flex items-center cursor-pointer py-3 ">
              <img
                src={
                  data.profilePicture
                    ? `https://instagram.f8team.dev${data.profilePicture}`
                    : "data:image/png;base64,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"
                }
                className="w-12 h-12 rounded-full p-1"
                alt=""
              />
              <h1 className="ml-3 font-bold text-[12px]">
                {data.userId.username}
              </h1>
            </div>

            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="cursor-pointer">
                    <MoreHorizontal />
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} className="w-100">
                  <DialogHeader>
                    <DialogTitle className="font-bold text-red-600">
                      Report
                    </DialogTitle>
                    <DialogTitle className="font-bold text-red-600">
                      Unfollow
                    </DialogTitle>
                    <DialogTitle>Add to favorites</DialogTitle>
                    <DialogTitle>Go to post</DialogTitle>
                    <DialogTitle>Share to...</DialogTitle>
                    <DialogTitle>Copy link </DialogTitle>
                    <DialogTitle>Embed</DialogTitle>
                    <DialogTitle>About this accounts</DialogTitle>
                    <DialogTitle className="border-none">Cancel</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* List Comment */}
          <div className="overflow-y-scroll overflow-hidden px-3 py-2 h-80">
            {/* {isLoading && (
              <p className="text-sm text-gray-400">Loading comments...</p>
            )} */}
            {data.comments.map((item) => (
              <div key={item._id} className=" mt-3">
                <div className="flex items-center cursor-pointer">
                  <NavLink to={`/users/${item.user._id}`}>
                    <img
                      src={
                        item?.profilePicture
                          ? `https://instagram.f8team.dev/${item.profilePicture}`
                          : `data:image/png;base64,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`
                      }
                      className="w-12 h-12 rounded-full p-1"
                      alt=""
                    />
                  </NavLink>
                  <div className="flex flex-col gap-1 ml-4">
                    <div className="flex items-center gap-2">
                      <NavLink to={`/users/${item.user._id}`}>
                        <h1 className="font-semibold text-sm">
                          {item.user.username}
                        </h1>
                      </NavLink>

                      <p className="text-sm text-gray-800">{item.content}</p>
                    </div>
                    {/* Like and Reply*/}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{dayjs(item.createdAt).fromNow()}</span>
                      <span className="cursor-pointer hover:text-gray-600">
                        {item.likes} likes
                      </span>
                      <button
                        className="cursor-pointer hover:text-gray-600"
                        onClick={() =>
                          setReplyTo({
                            commentId: item._id,
                            username: item.user.username,
                          })
                        }
                      >
                        Reply
                      </button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Ellipsis className="cursor-pointer" />
                        </DialogTrigger>

                        <DialogContent
                          showCloseButton={false}
                          className="w-100"
                        >
                          <DialogHeader>
                            {id === item.user._id ? (
                              <>
                                <DialogClose asChild>
                                  <DialogTitle
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setEditingComment({
                                        commentId: item._id,
                                        content: item.content,
                                      });
                                      setEditValue(item.content);
                                      setOpenEdit(true);
                                    }}
                                  >
                                    Chỉnh sửa
                                  </DialogTitle>
                                </DialogClose>

                                <DialogClose asChild>
                                  <DialogTitle
                                    className="cursor-pointer text-red-600"
                                    onClick={() =>
                                      deleteCommentMutation.mutate({
                                        postId: postId,
                                        commentId: item._id,
                                      })
                                    }
                                  >
                                    Xóa bỏ
                                  </DialogTitle>
                                </DialogClose>

                                <DialogClose asChild>
                                  <DialogTitle className="cursor-pointer">
                                    Đóng
                                  </DialogTitle>
                                </DialogClose>
                              </>
                            ) : (
                              <>
                                <DialogTitle className="cursor-pointer text-red-600">
                                  Tố cáo
                                </DialogTitle>

                                <DialogClose asChild>
                                  <DialogTitle className="cursor-pointer">
                                    Đóng
                                  </DialogTitle>
                                </DialogClose>
                              </>
                            )}
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
                          </DialogHeader>

                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full border p-2 rounded"
                            autoFocus
                          />

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="ghost"
                              onClick={() => setOpenEdit(false)}
                            >
                              Hủy
                            </Button>

                            <Button
                              onClick={() => {
                                if (!editValue.trim()) return;

                                updateCommentMutation.mutate({
                                  postId: postId,
                                  commentId: editingComment!.commentId,
                                  content: editValue,
                                });

                                setOpenEdit(false);
                                setEditingComment(null);
                              }}
                            >
                              Lưu
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                {postId !== null && postId !== "" && (
                  <ReplyComment
                    comment={item}
                    postId={postId}
                    forceOpen={openReplyFor === item._id}
                  />
                )}
              </div>
            ))}
          </div>
          <div>
            <div className="shrink-0  w-[100%]">
              <div className="flex gap-3 border-t border-t-gray-400 py-2">
                <Heart
                  className={`transition-transform duration-200 group-hover:scale-110 cursor-pointer ${
                    data.isLiked ? "text-red-500 fill-red-500" : "text-black"
                  }`}
                  onClick={() => likeMutation.mutate(data._id)}
                  size={23}
                />
                <MessageCircle
                  className="transition-transform duration-200 hover:scale-110"
                  size={23}
                />
                <ArrowRightLeft
                  className="transition-transform duration-200 hover:scale-110"
                  size={23}
                />
                <Send
                  className="transition-transform duration-200 hover:scale-110"
                  size={23}
                />
                <Bookmark
                  className="transition-transform duration-200 hover:scale-110x"
                  size={23}
                />
              </div>
              <div>
                <h1 className="font-bold">{data.likes} like</h1>
                <p className="text-[13px] text-gray-400">
                  {dayjs(data.createdAt).fromNow()}
                </p>
                <div className="border-t border-t-gray-400 py-2">
                  {replyTo && (
                    <div className="text-sm text-gray-500 mb-1 flex justify-between">
                      <span>
                        Replying to <b>@{replyTo.username}</b>
                      </span>
                      <button
                        className="text-xs text-red-500"
                        onClick={() => setReplyTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Annoyed />

                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      type="text"
                      placeholder={
                        replyTo
                          ? `Reply to @${replyTo.username}...`
                          : "Add comments..."
                      }
                      className="outline-none ml-3 w-[80%]"
                    />

                    <button
                      onClick={() => {
                        if (!comment.trim()) return;

                        if (replyTo) {
                          replyMutation.mutate(
                            {
                              postId: data._id,
                              commentId: replyTo.commentId,
                              content: comment,
                            },
                            {
                              onSuccess: () => {
                                setOpenReplyFor(replyTo.commentId);
                              },
                            },
                          );
                        } else {
                          //GỬI COMMENT
                          commentMutation.mutate({
                            postId: data._id,
                            content: comment,
                          });
                        }

                        setComment("");
                        setReplyTo(null);
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

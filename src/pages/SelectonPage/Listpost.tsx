import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  ArrowRightLeft,
  Send,
  Bookmark,
  Annoyed,
  Ellipsis,
} from "lucide-react";
import { useAuthStore } from "@/stores/infoUser";
import { useQuery } from "@tanstack/react-query";
import {
  deletePost,
  editCaptionPost,
  likePost,
  newPost,
} from "@/service/postServices";
import { postDetail } from "@/service/postServices";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createComment,
  deleteComment,
  editComment,
  listReplyPost,
  replyComment,
} from "@/service/comment";
import ReplyComment from "./ReplyComment";
import { AxiosError } from "axios";
dayjs.extend(relativeTime);
dayjs.locale("vi");
export default function Listpost() {
  const navigate = useNavigate();
  const [postId, setPostId] = useState<string | null>(null);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["newPost"],
    queryFn: newPost,
  });

  type DialogMode = "menu" | "edit";

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>("menu");
  const [activePostId, setActivePostId] = useState<string | null>(null);
  // edit comment
  const [openEdit, setOpenEdit] = useState(false);
  const [editingComment, setEditingComment] = useState<null | {
    commentId: string;
    content: string;
  }>(null);
  const [editValue, setEditValue] = useState("");
  const [caption, setCaption] = useState("");
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<null | {
    commentId: string;
    username: string;
  }>(null);
  const currentUser = useAuthStore((s) => s.user);
  console.log(data);

  const { data: postDetailData, isLoading } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: () => postDetail(postId as string),
    enabled: !!postId,
  });
  console.log(postId);
  const queryClient = useQueryClient();

  // Edit post
  const editCaptionMutation = useMutation({
    mutationFn: ({ postId, caption }: { postId: string; caption: string }) => {
      const token = localStorage.getItem("access_token");
      return editCaptionPost(token!, postId, caption);
    },

    onSuccess: () => {
      toast.success("Sửa thành công 🎉");

      // REAL TIME
      queryClient.invalidateQueries({
        queryKey: ["newPost"],
      });

      setOpen(false);
      setMode("menu");
      setActivePostId(null);
    },

    onError: () => {
      toast.error("Sửa thất bại");
    },
  });

  // Like post
  const likeMutation = useMutation({
    mutationFn: (postId: string) => {
      const token = localStorage.getItem("access_token");
      return likePost(token!, postId);
    },

    onSuccess: (res, postId) => {
      queryClient.setQueryData(["newPost"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            posts: oldData.data.posts.map((post: any) =>
              post._id === postId
                ? {
                    ...post,
                    likes: res.data.data.likes,
                    isLiked: !post.isLiked,
                  }
                : post,
            ),
          },
        };
      });
    },
  });

  // Xoa post

  const handleDelete = async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      await deletePost(accessToken, postId!);

      toast.success("Xóa bài viết thành công 🗑️");

      queryClient.invalidateQueries({
        queryKey: ["newPost"],
      });

      setOpen(false);
      setActivePostId(null);
      setPostId(null);
    } catch (error) {
      console.log(error);
      toast.error("Xóa thất bại");
    }
  };

  const deleteCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => {
      const accessToken = localStorage.getItem("access_token");
      console.log(accessToken);
      return deleteComment(accessToken, postId, commentId);
    },

    onSuccess: (_, { postId, commentId }) => {
      toast.success("Xóa comment thành công 🗑️");

      // Cập nhật list comment realtime
      queryClient.setQueryData(["postDetail", postId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            comments: old.data.comments.filter((c: any) => c._id !== commentId),
          },
        };
      });

      // Giảm số comment ngoài post list
      queryClient.setQueryData(["newPost"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            posts: old.data.posts.map((p: any) =>
              p._id === postId ? { ...p, comments: p.comments - 1 } : p,
            ),
          },
        };
      });
    },

    onError: (error: AxiosError<any>) => {
      console.log("DELETE COMMENT ERROR");

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("Message:", error.response?.data?.message);

      toast.error(error.response?.data?.message || "Xóa comment thất bại ❌");
    },
  });
  console.log(data);

  // Comment post
  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => {
      const token = localStorage.getItem("access_token")!;
      return createComment(token, postId, content);
    },
    onSuccess: (res, { postId }) => {
      toast.success("Đã thêm comment 💬");

      //update realtime comment list
      queryClient.setQueryData(["postDetail", postId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            comments: [
              {
                _id: res.data.data._id,
                content: res.data.data.content,
                createdAt: res.data.data.createdAt,
                parentCommentId: null,
                user: currentUser,
              },
              ...old.data.comments,
            ],
          },
        };
      });
      //update số comment ngoài list post
      queryClient.setQueryData(["newPost"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            posts: old.data.posts.map((post: any) =>
              post._id === postId
                ? { ...post, comments: post.comments + 1 }
                : post,
            ),
          },
        };
      });
    },
  });

  // reply

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

    onSuccess: (res, variables) => {
      const { postId, commentId } = variables;
      toast.success("Đã thêm reply 💬");

      queryClient.invalidateQueries({
        queryKey: ["replyComment", variables.postId, variables.commentId],
      });

      setOpenReplyFor(variables.commentId);

      //   queryClient.setQueryData(
      //     ["replyComment", postId, commentId],
      //     (old: any) => {
      //       if (!old) return old;
      //       return {
      //         ...old,
      //         data: {
      //           ...old.data,
      //           replies: [...old.data.replies, res.data.data],
      //           total: old.data.total + 1,
      //         },
      //       };
      //     },
      //   );
    },
  });

  // Edit Comment
  const updateCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      content,
    }: {
      postId: string;
      commentId: string;
      content: string;
    }) => {
      const token = localStorage.getItem("access_token")!;
      return editComment(token, postId, content, commentId);
    },

    onSuccess: (res, { postId, commentId, content }) => {
      toast.success("Đã cập nhật comment");

      queryClient.setQueryData(["postDetail", postId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            comments: old.data.comments.map((c: any) =>
              c._id === commentId ? { ...c, content } : c,
            ),
          },
        };
      });
    },
  });

  const user = useAuthStore((s) => s.user);
  const id = useAuthStore((s) => s.user?._id);
  console.log(postId);
  return (
    <div>
      {data?.data?.posts?.map((item) => (
        <div key={item?._id} className="w-[500px] mx-auto mt-10 ">
          {/* Name User Post */}
          <div className="flex items-center px-3 justify-between">
            {/* Avatar user */}
            <div className="flex items-center cursor-pointer">
              <img
                onClick={() => navigate(`/users/${item?.userId?._id}`)}
                src={
                  item.image
                    ? `https://instagram.f8team.dev${item.image}`
                    : `data:image/png;base64,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`
                }
                className="w-12 h-12 rounded-full p-1"
                alt=""
              />
              <h1 className="ml-3 font-bold text-[12px]">
                {item?.userId.username} -
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
                        <Button variant="ghost" onClick={() => setMode("menu")}>
                          Back
                        </Button>

                        <Button
                          disabled={editCaptionMutation.isLoading}
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
                          {editCaptionMutation.isLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Img post */}
          {item.mediaType === "image" && item.image && (
            <img
              src={`https://instagram.f8team.dev${item.image}`}
              alt="post"
              className="w-[500px] mx-auto mt-10 "
            />
          )}

          {item.mediaType === "video" && item.video && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-[300px] mx-auto mt-10 "
              src={`https://instagram.f8team.dev${item.video}`}

              //   className="w-full max-h-[600px] rounded-md"
            />
          )}
          <div>
            <div className="flex gap-3 mt-4 px-3 justify-between">
              <div className="flex gap-3">
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Heart
                    className={`transition-transform duration-200 group-hover:scale-110 cursor-pointer ${
                      item.isLiked ? "text-red-500 fill-red-500" : "text-black"
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
                        <span>{item.comments}</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[80%] h-[80%] flex">
                      {item.mediaType === "image" && item.image && (
                        <img
                          src={`https://instagram.f8team.dev${item.image}`}
                          alt="post"
                          className="w-[50%] h-[80%] my-auto"
                        />
                      )}

                      {item.mediaType === "video" && item.video && (
                        <video
                          src={`https://instagram.f8team.dev${item.video}`}
                          controls
                          className="w-[50%] h-[80%] my-auto"
                        />
                      )}

                      <div className="w-[45%]">
                        <div className="flex items-center px-3 justify-between border-b border-b-gray-500 ">
                          {/* Avatar user */}
                          <div className="flex items-center cursor-pointer py-3 ">
                            <img
                              src={
                                item.profilePicture
                                  ? `https://instagram.f8team.dev${item.profilePicture}`
                                  : "https://pethouse.com.vn/wp-content/uploads/2022/12/Ngoai-hinh-husky-768x1024-1.jpg"
                              }
                              className="w-12 h-12 rounded-full p-1"
                              alt=""
                            />
                            <h1 className="ml-3 font-bold text-[12px]">
                              {item.userId.username}
                            </h1>
                          </div>

                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="cursor-pointer"
                                >
                                  <MoreHorizontal />
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                showCloseButton={false}
                                className="w-100"
                              >
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
                                  <DialogTitle className="border-none">
                                    Cancel
                                  </DialogTitle>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        {/* List Comment */}
                        <div className="ml-2 overflow-y-auto h-[57%]">
                          {isLoading && (
                            <p className="text-sm text-gray-400">
                              Loading comments...
                            </p>
                          )}
                          {postDetailData?.data?.comments?.map((item) => (
                            <div key={item._id} className=" mt-3">
                              <div className="flex items-center cursor-pointer">
                                <NavLink to={`/users/${item.user?._id}`}>
                                  <img
                                    src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                                    className="w-12 h-12 rounded-full p-1"
                                    alt=""
                                  />
                                </NavLink>
                                <div className="flex flex-col gap-1 ml-4">
                                  <div className="flex items-center gap-2">
                                    <NavLink to={`/users/${item?.user?._id}`}>
                                      <h1 className="font-semibold text-sm">
                                        {item.user?.username}
                                      </h1>
                                    </NavLink>

                                    <p className="text-sm text-gray-800">
                                      {item?.content}
                                    </p>
                                  </div>
                                  {/* Like and Reply*/}
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span>
                                      {dayjs(item.createdAt).fromNow()}
                                    </span>
                                    <span className="cursor-pointer hover:text-gray-600">
                                      {item?.likes} likes
                                    </span>
                                    <button
                                      className="cursor-pointer hover:text-gray-600"
                                      onClick={() =>
                                        setReplyTo({
                                          commentId: item._id,
                                          username: item.user?.username,
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
                                          {id === item?.user?._id ? (
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
                                                    deleteCommentMutation.mutate(
                                                      {
                                                        postId:
                                                          item.postId ||
                                                          postId!,
                                                        commentId: item._id,
                                                      },
                                                    )
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
                                    <Dialog
                                      open={openEdit}
                                      onOpenChange={setOpenEdit}
                                    >
                                      <DialogContent className="sm:max-w-[400px]">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Chỉnh sửa bình luận
                                          </DialogTitle>
                                        </DialogHeader>

                                        <input
                                          value={editValue}
                                          onChange={(e) =>
                                            setEditValue(e.target.value)
                                          }
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
                                                postId: postId!,
                                                commentId:
                                                  editingComment!.commentId,
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
                              <ReplyComment
                                comment={item}
                                postId={postId}
                                forceOpen={openReplyFor === item._id}
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="">
                            <div className="flex gap-3 border-t border-t-gray-400 py-2">
                              <Heart
                                className={`transition-transform duration-200 group-hover:scale-110 cursor-pointer ${
                                  item.isLiked
                                    ? "text-red-500 fill-red-500"
                                    : "text-black"
                                }`}
                                onClick={() => likeMutation.mutate(item._id)}
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
                              <h1 className="font-bold">{item.likes} like</h1>
                              <p className="text-[13px] text-gray-400">
                                {dayjs(item.createdAt).fromNow()}
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
                                            postId: item._id,
                                            commentId: replyTo.commentId,
                                            content: comment,
                                          },
                                          {
                                            onSuccess: () => {
                                              setOpenReplyFor(
                                                replyTo.commentId,
                                              );
                                            },
                                          },
                                        );
                                      } else {
                                        //GỬI COMMENT
                                        commentMutation.mutate({
                                          postId: item._id,
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
                    </DialogContent>
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
    </div>
  );
}

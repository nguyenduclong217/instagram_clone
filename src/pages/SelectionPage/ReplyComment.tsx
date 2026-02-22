import { listReplyPost } from "@/service/comment";
import type { PostComment } from "@/types/post.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
type ReplyCommentProps = {
  comment: PostComment;
  postId: string;
  forceOpen: boolean;
};

export default function ReplyComment({
  comment,
  postId,
  forceOpen,
}: ReplyCommentProps) {
  const [showReplies, setShowReplies] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["replyComment", postId, comment._id],
    queryFn: () => listReplyPost(postId, comment._id),
    enabled: true,
  });
  console.log(data);

  useEffect(() => {
    if (forceOpen) {
      setShowReplies(true);
    }
  }, [forceOpen]);
  // const totalReplies = data?.total ?? 0;
  return (
    <div className="ml-12 mt-1">
      {data && data.length > 0 && (
        <button
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={() => setShowReplies((prev) => !prev)}
        >
          {showReplies ? "Ẩn phản hồi" : `Xem phản hồi`}
        </button>
      )}
      {showReplies && (
        <div className="mt-2">
          {isLoading && <p className="text-xs">Đang tải...</p>}

          {data?.map((reply) => (
            <div key={reply._id} className="text-sm mt-1">
              <b>{reply.userId.username}</b> {reply.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

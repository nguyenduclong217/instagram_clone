import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { userPost } from "@/service/postServices";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PostDetailContent from "./PostDetailContent";
import { useState } from "react";
export default function UserPost() {
  const [postId, setPostId] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const { data } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => userPost(userId as string),
    enabled: userId !== undefined,
  });
  console.log(data);
  return (
    <div>
      <div className="flex mx-auto h-full">
        <div className="pt-4 w-full">
          <div className="w-full grid grid-cols-4 gap-1">
            {data?.data.posts.map((item) => (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center gap-1 cursor-pointer group"
                    onClick={() => setPostId(item._id)}
                  >
                    <div
                      key={item._id}
                      className="aspect-[4/5] overflow-hidden rounded-md bg-gray-200"
                    >
                      {item.mediaType === "image" &&
                        item.image !== undefined &&
                        item.image !== "" && (
                          <img
                            src={`https://instagram.f8team.dev${item.image}`}
                            alt="post"
                            className="w-full h-full object-cover"
                          />
                        )}

                      {item.mediaType === "video" &&
                        item.video !== undefined &&
                        item.video !== "" && (
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            src={`https://instagram.f8team.dev${item.video}`}
                          />
                        )}
                    </div>
                  </button>
                </DialogTrigger>
                {postId !== null && <PostDetailContent postId={postId} />}
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

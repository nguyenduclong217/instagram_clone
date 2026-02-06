import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { userPost } from "@/service/postServices";
export default function UserPost() {
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => userPost(userId as string),
    enabled: !!userId,
  });
  console.log(data);
  return (
    <div>
      <div className="flex mx-auto h-full">
        <div className="pt-4 w-full">
          <div className="w-full grid grid-cols-4 gap-1">
            {data?.data?.posts?.map((item) => (
              <div
                key={item._id}
                className="aspect-[4/5] overflow-hidden rounded-md bg-gray-200"
              >
                {item.mediaType === "image" && item.image && (
                  <img
                    src={`https://instagram.f8team.dev${item.image}`}
                    alt="post"
                    className="w-full h-full object-cover"
                  />
                )}

                {item.mediaType === "video" && item.video && (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

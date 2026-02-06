import { explorePost } from "@/service/postServices";
import { useQuery } from "@tanstack/react-query";

export default function Explore() {
  const { data, isLoading } = useQuery({
    queryKey: ["listPost"],
    queryFn: explorePost,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex ml-20 w-[90%] h-full">
      <div className="pt-4 w-full">
        <div className="grid grid-cols-5 gap-2">
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
  );
}

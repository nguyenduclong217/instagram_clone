import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { listUser } from "@/service/inforUser";
import { followUser, unFollowUser } from "@/service/status";
import toast from "react-hot-toast";
import { userAuthStore, type ListUserResponse } from "@/types/user.type";

export default function ListUserUnFollow() {
  const queryClient = useQueryClient();

  const user = userAuthStore((s) => s.user);
  const { data } = useQuery<ListUserResponse>({
    queryKey: ["listUser"],

    queryFn: () => {
      const token = localStorage.getItem("access_token")!;
      return listUser(token);
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: (userId: string) => {
      const token = localStorage.getItem("access_token")!;
      return unFollowUser(token, userId);
    },

    onMutate: async (userId) => {
      // Hủy query đang chạy
      await queryClient.cancelQueries({ queryKey: ["listUser"] });

      // Backup data cũ
      const previousData = queryClient.getQueryData<ListUserResponse>([
        "listUser",
      ]);

      // Update UI NGAY LẬP TỨC
      queryClient.setQueryData<ListUserResponse>(["listUser"], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((u) =>
            u._id === userId ? { ...u, isFollowing: false } : u,
          ),
        };
      });

      // Trả về context để rollback
      return { previousData };
    },

    onError: (_err, _userId, context) => {
      // Rollback nếu API fail
      queryClient.setQueryData(["listUser"], context?.previousData);
      toast.error("Unfollow thất bại ");
    },

    onSuccess: () => {
      toast.success("Đã bỏ theo dõi");
    },
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => {
      const token = localStorage.getItem("access_token")!;
      return followUser(token, userId);
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["listUser"] });

      const previousData = queryClient.getQueryData<ListUserResponse>([
        "listUser",
      ]);

      queryClient.setQueryData<ListUserResponse>(["listUser"], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((u) =>
            u._id === userId ? { ...u, isFollowing: true } : u,
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _userId, context) => {
      queryClient.setQueryData(["listUser"], context?.previousData);
      toast.error("Follow thất bại");
    },

    onSuccess: () => {
      toast.success("Follow thành công");
    },
  });

  return (
    <div>
      <NavLink
        to={`/users/${user?._id}`}
        className="flex px-2 items-center gap-1 cursor-pointer"
      >
        <img
          src={
            user?.profilePicture !== null
              ? `https://instagram.f8team.dev${user?.profilePicture}`
              : `data:image/png;base64,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`
          }
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <div className="w-[62%]">
          <h1 className="font-semibold">{user?.fullName} </h1>
          <p className="text-[14px] text-gray-400">{user?.fullName}</p>
        </div>
        <button className="h-fit text-[13px] text-blue-600 underline cursor-pointer">
          Switch
        </button>
      </NavLink>

      {/* List Friend */}
      <div className="mt-3">
        <div className="flex px-2 justify-between">
          <h1 className="font-semibold text-[15px]">Suggested for you</h1>
          <button className="text-[13px] cursor-pointer hover:text-gray-400 font-semibold">
            See all
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-3">
          {data?.data.map((item) => (
            <div
              className="flex px-2 items-center gap-1 cursor-pointer"
              key={item._id}
            >
              <NavLink to={`/users/${item._id}`} />
              <NavLink
                to={`/users/${item._id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={
                    item.profilePicture
                      ? `https://instagram.f8team.dev${item.profilePicture}`
                      : "data:image/png;base64,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"
                  }
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              </NavLink>

              <NavLink to={`/users/${item._id}`} className="w-[55%]">
                <h1 className="font-semibold"> {item.username}</h1>
                <p className="text-[14px] text-gray-400">Followed by meo meo</p>
              </NavLink>
              <button
                disabled={
                  followMutation.isPending || unFollowMutation.isPending
                }
                onClick={() => {
                  if (item.isFollowing) {
                    unFollowMutation.mutate(item._id);
                  } else {
                    followMutation.mutate(item._id);
                  }
                }}
                className={`font-semibold text-[12px] ${
                  item.isFollowing ? "text-gray-400" : "text-blue-500"
                }`}
              >
                {item.isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/*Footer*/}
      <div className="mt-6">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-400 ">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Press
          </a>
          <a href="#" className="hover:underline">
            API
          </a>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Locations
          </a>
          <a href="#" className="hover:underline">
            Language
          </a>
          <a href="#" className="hover:underline">
            Meta Verified
          </a>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          © 2026 Instagram from Meta
        </div>
      </div>
    </div>
  );
}

import {
  Settings,
  Plus,
  Grid3x3,
  Bookmark,
  UserSquare,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "./Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import {
  follower,
  following,
  profileUser,
  removeAvt,
  updateProfile,
  infoUserId,
} from "@/service/inforUser";
// import { useAuthStore } from "@/stores/infoUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserPost from "./SelectionPage/UserPost";
import { followUser, unFollowUser } from "@/service/status";
import { userAuthStore } from "@/types/user.type";
import { useCreateConversation } from "@/hooks/useCreateConversation";
// import { userAuthStore, type InfoUser } from "@/types/user.type";

const schema = z.object({
  fullName: z
    .string()
    .min(3, {
      message: "Tên tối thiểu 3 kí tự",
    })
    .max(20, {
      message: "Tên người dùng tối đa 20 kí tự",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Chỉ được chứa chữ, số và dấu _",
    }),
  bio: z.string().optional(),
  profilePicture: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) =>
        !files || files.length === 0 || files[0].size <= 2 * 1024 * 1024,
      { message: "Ảnh phải nhỏ hơn 2MB" },
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
      { message: "Chỉ chấp nhận JPG, PNG, WEBP" },
    ),
  gender: z.string().optional(),
  website: z.string(),
});
type ChangeInfo = {
  fullName?: string;
  bio?: string;
  website?: string;
  gender?: string;
  profilePicture?: FileList;
};

export default function UserInfo() {
  const navigate = useNavigate();
  const createConversationMutation = useCreateConversation();
  const { userId } = useParams<{ userId: string }>();
  const setUser = userAuthStore((s) => s.setUser);
  const user = userAuthStore((s) => s.user);
  const accessToken = localStorage.getItem("access_token");
  const clearUser = userAuthStore((s) => s.clearUser);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [openEdit, setOpenEdit] = useState(false);

  const queryClient = useQueryClient();
  const followMutation = useMutation({
    mutationFn: (userId: string) => {
      if (accessToken === null) throw new Error("No accessToken");
      return followUser(accessToken, userId);
    },
    onSuccess: async (_, userId) => {
      toast.success("Đã theo dõi");
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
    },
  });

  //unfollow
  const unFollowMutation = useMutation({
    mutationFn: (userId: string) => {
      if (accessToken === null) throw new Error("No accessToken");
      return unFollowUser(accessToken, userId);
    },
    onSuccess: async (_, userId) => {
      toast.success("Đã bỏ theo dõi");
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields, isValid },
  } = useForm<ChangeInfo>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  console.log(userId);
  const { data } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => infoUserId(userId as string),
    enabled: userId !== "",
  });

  // follower
  const {
    data: followerData,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: ["userFollower", userId],
    queryFn: () => follower(userId as string),
    enabled: userId !== "",
  });
  console.log(followerData);
  // following
  const {
    data: followingData,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: ["userFollowing", userId],
    queryFn: () => following(userId as string),
    enabled: userId !== "",
  });

  console.log(followingData);
  console.log(data);

  const hasAnyChange =
    dirtyFields.fullName === true ||
    dirtyFields.bio === true ||
    dirtyFields.gender === true ||
    dirtyFields.profilePicture === true ||
    dirtyFields.website === true;

  const onSubmit: SubmitHandler<ChangeInfo> = async (data) => {
    try {
      if (accessToken === null) throw new Error("No accessToken");

      const formData = new FormData();
      if (data.fullName !== undefined && data.fullName.trim() !== "")
        formData.append("fullName", data.fullName);
      if (data.bio !== undefined && data.bio.trim() !== "")
        formData.append("bio", data.bio);
      if (data.website !== undefined && data.website.trim() !== "")
        formData.append("website", data.website);
      if (data.gender !== undefined) formData.append("gender", data.gender);

      if (data.profilePicture && data.profilePicture.length > 0) {
        formData.append("profilePicture", data.profilePicture[0]);
      }
      const updateUser = await updateProfile(formData, accessToken);
      setUser(updateUser);
      setOpenEdit(false);
      toast.success("Cập nhật profile thành công");
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }

    console.log(data);
  };

  const handleRemoveAvt = useMutation({
    mutationFn: () => {
      if (accessToken === null || accessToken === "")
        throw new Error("No token");
      return removeAvt(accessToken);
    },

    onSuccess: () => {
      setUser({ ...user, profilePicture: null });
      toast.success("Xóa ảnh thành công");
    },

    onError: () => {
      toast.error("Xóa ảnh thất bại");
    },
  });

  // setUser = userAuthStore((s) => s.setUser);
  const { data: infoUser } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => {
      if (accessToken === null) throw new Error("No accessToken");
      return profileUser(accessToken);
    },
    enabled: accessToken !== null,
  });

  console.log(infoUser);
  // useEffect(() => {
  //   if (!data?.data?.profilePicture) return;
  //   setAvatar(`https://instagram.f8team.dev${data?.data?.profilePicture}`);
  //   const fetchProfile = async () => {
  //     const accessToken = localStorage.getItem("access_token");
  //     if (!accessToken) return;

  //     try {
  //       const response = await profileUser(accessToken);
  //       if (response?.data) {
  //         setUser(response.data);
  //       }
  //     } catch {
  //       clearUser();
  //     }
  //   };

  //   fetchProfile();
  // }, [data?.data?.profilePicture]);

  const [open, setOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const avatarUrl = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user?.profilePicture != null
      ? `https://instagram.f8team.dev${user.profilePicture}`
      : "data:image/png;base64,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";

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setAvatarFile(file);
    setValue("profilePicture", e.target.files ?? undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const preview = URL.createObjectURL(file);
    setAvatar(preview);
  };

  useEffect(() => {
    if (!avatarFile) return;

    const url = URL.createObjectURL(avatarFile);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);
  return (
    <div className="w-[900px] ml-20 mt-12">
      {/* Header */}
      <div className="w-[70%] mx-auto flex gap-3">
        <button className="cursor-pointer">
          {user?._id === userId ? (
            <img
              src={
                user?.profilePicture !== null
                  ? `https://instagram.f8team.dev${user.profilePicture}`
                  : `data:image/png;base64,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`
              }
              alt=""
              className="w-40 h-40 rounded-full"
            />
          ) : (
            <img
              src={
                data
                  ? `https://instagram.f8team.dev${data.profilePicture}`
                  : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEXZ3OFveH/c3+RrdHtpcnlncXjIzNHS1tve4eaGjZTFyc96gonW2d7N0daUm6GssbeOlZuboqeyt728wcZ0fYShp614gYiKkZiRmZ63vMGCiZC/xMmYn6WgpqxjXxUbAAAFrElEQVR4nO2dW5uiMAyGJVQpAoIKzqjs//+bW2Qcz0pp2qZM3ouZ3bnie9KkSQ/pbMYwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDPNnAcXtPyaFnCXbZpXu6qjepatmm6i/TAiYLZqDEHEc9cSxEIdmMZuKJSHfpL/iLsRxusmnoBFm5U48yOsRuzJ8O8p99krfSWO2D9sfIane6TtprJKAzSi30aP/PfhjtA3WjNDMP+rrmDehWnE1TKCSuPL9qeNIP7ngBZH6/tgxpJ9d8EIcoMQvHYFK4pfvD9YEVnoClcRVUOFGlsN98IwoA5o0YKsvUEnchmPFpB4hMIrqxPeHDwW+dZ2wJ/4OxIiwHTrT3zMPZZyOG6Mdte9PH4RsxoSZHtGEEE/zcU7YE+e+P/8zsjFSGIARcwN9HeSNCKWJCZURS/LhNDO0YeZbwAdgaWZCZcQlbSPKtbHCNfFYYzpIyQ/ThakJlREXvkW8A0bUhfcI0tFUVgg2rCg7Yn4wFhhFB8qTfoEgMIoK3zJeA8uxleE1c8IzIuzNA40KNXvCCg2T0h7KqSkYVU6/Cglv1JjnbCeFhPM2VsgKA1D4D0XhP7oKpx9L/8B8uEHJaTaEFY7aVXtQSHj3YvqZ96xA8UPC1dPYrdFbaG+UotT4vkW8Q2ofwXgkXtGd8HEmRMrTYRdMEVYTKYdSlFBDO9DMIDVWmJI2IYIj0nbDzhGNbUjbDZVE0xnxQFzgX9jlTgxtSDuSdpilNbQTmh8WJpO+IL09+oPJHiLtvcNfCoNzbZRLwwvjj+6FcXCvY+yBDOLHMC6MPTZE/bDQFWOO6od2WH894jbCOhgLdsBKV6II60aJotWTKFrfH6zN0MuHPUFeQRx0gbQn1GukkFQD75CGexVYHt9e5O4R2TFIA/YA7A9Pmg1cjc/4sA+8SQbI5TqLn6pUf83WSxm2vg6Qs2VZZXHXF6OTevqp/pNV5XI2AX0nAGReHDdN+119pV/Vd9tsjkUuAx+eD4DS2Ynqf01MHMMwDMMwf4Quo4EL08pqVOqdJ8t92bQqK00PqcpM26bcL5N8Aom3slSy2LRpLeY/lcVP2aSqi7mo03azSAK2piooVNm0U4XS6wJYiJ0qovIQbankbdsXpe9jIdxuQxMJcGzrN7Z7tGXdHgMarTIvswHGuzdlVuZhLEnJotWWdxbZFvQ1QrGaG+xyz1cF7bEKRavhfU81ipawRsibwQv5bzRGDdXGrbB/2YpVD7EjeYtUFh9blWporOiFHLlBGKAX4mhDSyLkiAbsERUlb5THGtOAPXFNZ08KoxvGM+h0yBjca1YXGr1pIdHoNauLSP3vDkOR4bvghTjzneHAwkKMuZFYL7xKRDia/xmfp92cCPQpERC6Qg0h9jVQAaffzhA8hZtk50zhzs8dBa2W5GZ4aWiu37HbSKL7s5njjgGPx/kBYji6tGBHfHRrRZRr6Xq4vVsKmu8CYBB/OTSiLG3VS++YO3RFlOYQ+rhrJyEdzoQ3ClNHRsTpQjMGV51rcvdx9EztpC0mTkOvcThpA+aqZHoh0UEhBQhtZg0UVtYVuk/X7iRaT958ZDM3Cm1nNuY9140lWl618euFJ4WWPdHgnjYWdu97g8e58Exs9a6p6fMcOFhMbPxlpNfYzE4lRjs2cw72UrfCR+H7yNxarMFpwGqOvRau0vx5DhwyW8PUa1Vxja1HPnB66GJgq5mUNO82h4WlBRvTHleYWFkdhi2VQaqGqZVWw2ZPxuFi5wE6Qm5oyREdbvl+xsamsN81tntsrLnhvCGDhY23aHDePcDCxvsJGM9x4WGlOR+N2vCMhabfpEKplWDq7gDUMPCrYKOmnfjgtwGFIzGF6PsXtKZDGxMinfK3B78IprIKdQZ/NWr6CmklbTbSNp/nE54x/MzCf1KbVTlwOOGiAAAAAElFTkSuQmCC`
              }
              alt=""
              className="w-40 h-40 rounded-full"
            />
          )}
        </button>
        <div className="p-3 flex-1">
          <div className="flex text-[24px]  items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="font-semibold cursor-pointer">
                  {user?._id === userId ? user?.username : data?.fullName}
                </button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="w-170 px-10 py-5"
              >
                <h1 className="text-center font-semibold border-b border-b-gray-400 h-10">
                  About your account
                </h1>
                <div>
                  <img
                    src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                    alt=""
                    className="w-20 h-20 rounded-full mx-auto my-2"
                  />
                  <h1 className="font-semibold text-center">hehe</h1>
                  <p className="text-[12px] text-gray-500 text-center">
                    To help keep our community authentic, we’re showing
                    information about accounts on Instagram. People can see this
                    by tapping on the ••• on your profile and choosing About
                    This Account.{" "}
                    <span className="text-blue-600">
                      See why this information is important.
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays />
                  <div>
                    <h1>Date joined</h1>
                    <p className="text-[14px] text-gray-400">June 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin />
                  <div>
                    <h1>Account based in</h1>
                    <p className="text-[14px] text-gray-400">Vietnam</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {/* Setting */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="cursor-pointer">
                  <Settings size={30} />
                </button>
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="w-100">
                <DialogHeader>
                  <DialogTitle>Apps and websites</DialogTitle>
                  <DialogTitle>QR code</DialogTitle>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogTitle>Settings and privacy</DialogTitle>
                  <DialogTitle>Meta Verified</DialogTitle>
                  <DialogTitle>Supervision</DialogTitle>
                  <DialogTitle>Login activity</DialogTitle>
                  <DialogTitle>Log Out</DialogTitle>
                  <DialogTitle>Cancel</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-[14px] text-gray-700 my-1">
            {user?._id === userId ? user?.fullName : data?.fullName}
          </p>
          <p> {user?._id === userId ? user?.bio : data?.bio}</p>
          <p>{user?._id === userId ? user?.website : data?.website}</p>
          <div className="flex gap-3">
            <p className="">
              <span className="font-semibold">1</span> post
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 cursor-pointer group">
                  <p>
                    <span className="font-semibold">
                      {data?.followersCount}
                    </span>{" "}
                    Follower
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent className="w-100 h-[80%] p-0 flex flex-col gap-0">
                <div className="h-12 flex items-center justify-center border-b">
                  <h1 className="font-semibold">Followers</h1>
                </div>

                {/* Search */}
                <div className="p-3 ">
                  <input
                    type="text"
                    placeholder="Search"
                    className=" mt-0 w-full rounded-md bg-gray-100 px-3  py-2 text-sm outline-none focus:bg-white "
                  />
                </div>
                <div className="h-90 px-4 flex flex-col gap-2">
                  {followerData?.followers.map((item) => (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        onClick={() => void navigate(`/users/${item._id}`)}
                        src={
                          item?.profilePicture
                            ? `https://instagram.f8team.dev/${item.profilePicture}`
                            : `data:image/png;base64,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`
                        }
                        alt=""
                        className="w-15 h-15 rounded-full"
                      />
                      <div className="w-[72%]">
                        <h1 className="font-semibold">{item?.username}</h1>
                        <p className="text-[14px] text-gray-400">
                          {item?.fullName}
                        </p>
                      </div>
                      <Button className="cursor-pointer">Follow</Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Following */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 cursor-pointer group">
                  <p className="">
                    <span className="font-semibold">
                      {data?.followingCount}
                    </span>{" "}
                    Follow
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent className="w-100 h-[80%] p-0 flex flex-col gap-0">
                <div className="h-12 flex items-center justify-center border-b">
                  <h1 className="font-semibold">Followers</h1>
                </div>

                {/* Search */}
                <div className="p-3 ">
                  <input
                    type="text"
                    placeholder="Search"
                    className=" mt-0 w-full rounded-md bg-gray-100 px-3  py-2 text-sm outline-none focus:bg-white "
                  />
                </div>
                <div className="h-90 px-4 flex flex-col gap-2">
                  {followingData?.following.map((item) => (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={`https://instagram.f8team.dev${item?.profilePicture}`}
                        alt=""
                        className="w-15 h-15 rounded-full"
                      />
                      <div className="w-[72%]">
                        <h1 className="font-semibold">{item?.username}</h1>
                        <p className="text-[14px] text-gray-400">
                          {item?.fullName}
                        </p>
                      </div>
                      <Button className="cursor-pointer">Unfollow</Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-3 flex gap-1">
            <img
              src="data:image/png;base64,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"
              alt=""
              className="w-5 h-5"
            />
            <p className="font-semibold items-center text-[14px]">100M+</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="w-[70%] mx-auto mt-4">
          {user?._id === userId ? (
            <div>
              <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                  <Button
                    className="w-[49%] bg-gray-200 text-black hover:bg-gray-300"
                    onClick={() =>
                      setAvatar(
                        `https://instagram.f8team.dev${data?.profilePicture}`,
                      )
                    }
                  >
                    Edit profile
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} className="w-100">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleSubmit(onSubmit)(e);
                    }}
                    className="p-3"
                  >
                    <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                          <img
                            // src={`https://instagram.f8team.dev${data?.data?.profilePicture}`}
                            src={avatarUrl}
                            alt=""
                            className="w-15 h-15 rounded-full"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{user?.username}</p>
                          <p className="text-sm text-gray-500">
                            {user?.fullName}
                          </p>
                        </div>
                      </div>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                            Change Picture
                          </button>
                        </DialogTrigger>
                        <DialogContent
                          showCloseButton={false}
                          className="w-150  top-[50px] translate-y-0 left-1/2 -translate-x-1/2"
                        >
                          <DialogHeader>
                            <h1 className="text-center font-semibold py-5 border-b">
                              Change Profile Photo
                            </h1>
                            <DialogTitle
                              className="text-blue-600 font-semibold cursor-pointer"
                              onClick={() => fileRef.current?.click()}
                            >
                              Upload Photo
                            </DialogTitle>
                            <input
                              ref={fileRef}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={handleUpload}
                            />
                            <DialogTitle
                              className="text-red-600 font-semibold"
                              onClick={() => {
                                setOpen(false);
                                localStorage.removeItem("avatar");
                                handleRemoveAvt.mutate();
                              }}
                            >
                              Remove Current Photo
                            </DialogTitle>
                            <DialogTitle onClick={() => setOpen(false)}>
                              Cancel
                            </DialogTitle>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.fullName}
                        className="w-full px-4 py-3 rounded-md bg-gray-300 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        {...register("fullName")}
                      />
                      {errors.fullName?.message !== undefined && (
                        <span className="text-red-600 text-sm ml-2">
                          {errors.fullName.message}
                        </span>
                      )}
                    </div>

                    {/* Tiểu sử */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Tiểu sử
                      </label>
                      <textarea
                        defaultValue={user?.bio ?? ""}
                        rows={4}
                        className="w-full px-4 py-3 rounded-md bg-gray-300 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        {...register("bio")}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Website
                      </label>
                      <input
                        defaultValue={user?.website ?? ""}
                        type="text"
                        className="w-full px-2 py-2 rounded-md bg-gray-300 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        {...register("website")}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Giới tính
                      </label>
                      <select
                        {...register("gender")}
                        defaultValue={user?.gender ?? ""}
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="female">Nữ</option>
                        <option value="male">Nam</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    {/* Button */}
                    <button
                      type="submit"
                      disabled={!isValid || !hasAnyChange}
                      // onClick={() => setOpenEdit(false)}
                      className={`w-full py-3 mt-4 rounded-md font-medium transition
                     ${
                       !isValid || !hasAnyChange
                         ? "bg-gray-400 cursor-not-allowed"
                         : "bg-indigo-600 hover:bg-indigo-700 text-white"
                     }`}
                    >
                      Lưu thay đổi
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button className="ml-3 w-[49%] bg-gray-200 text-black300 hover:bg-gray-300">
                View archive
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              {data && !data.isFollowing ? (
                // CHƯA FOLLOW
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => followMutation.mutate(userId!)}
                >
                  Follow
                </Button>
              ) : (
                // ĐÃ FOLLOW
                <>
                  <Button
                    className="flex-1 bg-gray-200 text-black hover:bg-gray-300"
                    onClick={() => createConversationMutation.mutate(data?._id)}
                  >
                    Nhắn tin
                  </Button>

                  <Button
                    className="flex-1 bg-gray-200 text-black hover:bg-gray-300"
                    onClick={() => unFollowMutation.mutate(userId!)}
                  >
                    Bỏ theo dõi
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Story */}
      <div className="border-3 ml-38 mt-10 w-fit rounded-full">
        <Plus
          size={40}
          className="bg-gray-200 rounded-full text-gray-400 w-19 h-19 m-1"
        />
      </div>

      <div>
        <Tabs defaultValue="posts" className="w-full my-10">
          <TabsList
            variant="line"
            className="w-full border-b border-gray-300 justify-center gap-40"
          >
            <TabsTrigger
              value="posts"
              className="py-2 data-[state=active]:text-black"
            >
              <Grid3x3 className="size-6" />
            </TabsTrigger>

            <TabsTrigger
              value="saved"
              className="py-2 data-[state=active]:text-black"
            >
              <Bookmark className="size-6" />
            </TabsTrigger>

            <TabsTrigger
              value="tagged"
              className="py-2 data-[state=active]:text-black"
            >
              <UserSquare className="size-6" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <UserPost />
          </TabsContent>

          <TabsContent value="saved">
            <div className="h-80">
              <div className="flex justify-around gap-60">
                <h1 className="text-gray-500">
                  Only you can see what you've saved
                </h1>
                <button className="text-blue-700 hover:underline cursor-pointer">
                  + New Collection
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tagged">
            <div className="h-80 flex justify-center items-center flex-col">
              <div>
                <div className="border-2 border-black rounded-full">
                  <UserSquare className="size-19 p-2" />
                </div>
              </div>
              <h1 className="text-[28px] font-semibold">Photos of you</h1>
              <p>When people tag you in photos, they'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

import { NavLink, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  User,
  Plus,
  Menu,
  LayoutDashboard,
  X,
  Images,
  Settings,
  SquareActivity,
  Bookmark,
  Sun,
  MessageSquareWarning,
  Flag,
  Circle,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/service/authServices";
import CreatePost from "@/pages/SelectonPage/CreatePost";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSearchHistory,
  deleteAllSearch,
  deleteSearch,
  getSearchHistory,
  searchUser,
} from "@/service/search";

export default function Nav() {
  const [click, setClick] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openMeta, setOpenMeta] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  // Search
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const handleLogout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      toast.success("Đăng xuất thành công");
      navigate("/login"); // thieu replace
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["searchUser", debouncedValue],
    queryFn: () => searchUser(debouncedValue),
    enabled: !!debouncedValue.trim(),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);
  console.log(data);

  // Add History search

  const queryClient = useQueryClient();

  const addSearchHistoryMutation = useMutation({
    mutationFn: ({
      searchedUserId,
      searchQuery,
    }: {
      searchedUserId: string;
      searchQuery: string;
    }) => {
      const token = localStorage.getItem("access_token")!;
      return addSearchHistory(token, searchedUserId, searchQuery);
    },

    onSuccess: (res) => {
      queryClient.setQueryData(["searchHistory"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: [
            res.data, // ⬅️ item mới thêm lên đầu
            ...old.data,
          ],
        };
      });
    },
  });

  // History search
  const { data: historyData } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: () => getSearchHistory(),
  });

  // Delete search
  const deleteSearchMutation = useMutation({
    mutationFn: (historyId: string) => {
      const token = localStorage.getItem("access_token")!;
      return deleteSearch(token, historyId);
    },

    onMutate: async (historyId) => {
      await queryClient.cancelQueries({ queryKey: ["searchHistory"] });

      const previousData = queryClient.getQueryData<any>(["searchHistory"]);

      queryClient.setQueryData(["searchHistory"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((item) => item._id !== historyId),
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["searchHistory"], context?.previousData);
    },

    onSuccess: () => {
      toast.success("Đã xóa lịch sử tìm kiếm");
    },
  });

  //Delete all

  const clearAllSearchMutation = useMutation({
    mutationFn: () => {
      const accessToken = localStorage.getItem("access_token")!;
      return deleteAllSearch(accessToken);
    },

    onSuccess: () => {
      toast.success("Đã xóa toàn bộ lịch sử tìm kiếm");

      // 👉 cập nhật UI realtime
      queryClient.setQueryData(["searchHistory"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [],
        };
      });
    },

    onError: () => {
      toast.error("Xóa lịch sử thất bại");
    },
  });

  console.log(historyData);
  return (
    <div className="w-30">
      <Sidebar
        collapsible="icon"
        className={`transition-all duration-300 bar z-99 ${
          click || openCreate ? "w-56" : "w-21 hover:w-56"
        }`}
      >
        <div className="mt-1 ml-4 flex items-center p-1 ">
          <img
            src="https://freesvg.org/img/new-instagram-logo-glyph.png"
            alt=""
            className="text-red-600 w-8 h-8"
          />
          <span
            className={`text-2xl font-[Billabong] ml-3 whitespace-nowrap transition-opacity duration-20 opacity-0 group-hover:opacity-100 ${openCreate || openMore || openMeta ? "opacity-100" : ""}`}
          >
            Instagram
          </span>
        </div>
        <SidebarContent className="px-4">
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Home
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                    >
                      Home
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            {/* Reels */}
            <SidebarMenuItem>
              <NavLink to="/reels" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Home
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                    >
                      Reels
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            {/* Search */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => (setClick(false), setOpenSearch(true))}
              >
                <div className="flex items-center justify-center">
                  <Search className={`size-7`} />
                </div>
                <span
                  className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                >
                  Search
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Explore */}
            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <Compass
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                    >
                      Explore
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            {/* Message */}
            <SidebarMenuItem>
              <NavLink to="/messages">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <MessageCircle
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                    >
                      Messages
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            {/* Notifications */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => (setOpenNotifications(true), setClick(false))}
              >
                <div className="flex items-center justify-center">
                  <Heart className="size-7" />
                </div>
                <span
                  className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                >
                  Notifications
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Create */}
            <Popover
              open={openCreate}
              onOpenChange={(value) => {
                setOpenCreate(value);
                setClick(value);
              }}
            >
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  className={`p-2 rounded-[4px] hover:bg-gray-100 flex items-center w-full z-10 ${active === "create" ? "bg-muted font-semibold" : ""}`}
                  onClick={() =>
                    setActive(active === "create" ? null : "create")
                  }
                >
                  <div className="flex items-center justify-center">
                    <Plus
                      className={`size-7 ${active === "create" ? "text-black" : "text-gray-700"}`}
                    />
                  </div>
                  <span
                    className={`ml-3 whitespace-nowrap transition-opacity duration-200  opacity-group-hover:opacity-100${openCreate ? "opacity-100" : ""} ${active === "create" ? "text-black" : "text-gray-700"}`}
                  >
                    Create
                  </span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2 z-102">
                <div className="flex flex-col gap-1">
                  <CreatePost />
                  <button className="px-3 py-2 hover:bg-gray-100 rounded">
                    Delete
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile */}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <div className="flex items-center justify-center">
                  <User className="size-7" />
                </div>
                <span
                  className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                >
                  Profile
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* More */}
            <div className="mt-1">
              <Popover
                open={openMore}
                onOpenChange={(value) => {
                  setOpenMore(value);
                  setClick(value);
                }}
              >
                <PopoverTrigger asChild className="relative">
                  <SidebarMenuButton
                    className={`p-2 rounded-[4px] hover:bg-gray-100 flex items-center w-full ${active === "more" ? "bg-muted font-semibold" : ""}`}
                    onClick={() => setActive(active === "more" ? null : "more")}
                  >
                    <div className="flex items-center justify-center">
                      <Menu
                        className={`size-7 ${active === "more" ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200  opacity-group-hover:opacity-100${openMore ? "opacity-100" : ""} ${active === "more" ? "text-black" : "text-gray-700"}`}
                    >
                      More
                    </span>
                  </SidebarMenuButton>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-2 absolute left-28 bottom-[-20px] border shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
                  <div className="flex flex-col gap-1">
                    <div className=" mb-2 flex flex-col shadow-[0_6px_0px_rgba(0,0,0,0.08)]  ">
                      <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                        <Settings />
                        <span className="ml-3">Setting</span>
                      </button>
                      <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                        <SquareActivity />
                        <span className="ml-3 block">Your activity</span>
                      </button>
                      <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                        <Bookmark />
                        <span className="ml-3">Saved</span>
                      </button>
                      <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                        <Sun />
                        <span className="ml-3">Switch appearance</span>
                      </button>
                      <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                        <MessageSquareWarning />
                        <span className="ml-3">Report a problem</span>
                      </button>
                    </div>
                    <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                      <Flag />
                      <span className="ml-3">Threads</span>
                    </button>
                    <div className="flex flex-col gap-1 shadow-[0_-6px_0px_rgba(0,0,0,0.08)] mt-2">
                      <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer">
                        <span className="ml-3">Switch accounts</span>
                      </button>
                      <button
                        className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start cursor-pointer"
                        onClick={() => handleLogout()}
                      >
                        <span className="ml-3">Log out</span>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover
                open={openMeta}
                onOpenChange={(value) => {
                  setOpenMeta(value);
                  setClick(value);
                }}
              >
                <PopoverTrigger asChild className="relative">
                  <SidebarMenuButton
                    className={`p-2 rounded-[4px] hover:bg-gray-100 flex items-center w-full ${active === "meta" ? "bg-muted font-semibold" : ""}`}
                    onClick={() => setActive(active === "meta" ? null : "meta")}
                  >
                    <div className="flex items-center justify-center">
                      <LayoutDashboard
                        className={`size-7 ${active === "meta" ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200  opacity-group-hover:opacity-100${openMeta ? "opacity-100" : ""} ${active === "meta" ? "text-black" : "text-gray-700"}`}
                    >
                      Also from meta
                    </span>
                  </SidebarMenuButton>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-2 absolute left-28 bottom-[-20px] border shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
                  <div className="flex flex-col gap-1">
                    <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start">
                      <Circle />
                      <span className="ml-3">Meta AI</span>
                    </button>
                    <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start">
                      <Circle />
                      <span className="ml-3">AI Studio</span>
                    </button>
                    <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start">
                      <Phone />
                      <span className="ml-3">WhatsApp</span>
                    </button>
                    <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-start">
                      <Phone />
                      <span className="ml-3">Threads</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              {/* <SidebarMenuItem>
                <SidebarMenuButton>
                  <div className="flex items-center justify-center">
                    <LayoutDashboard className="size-7" />
                  </div>

                  <span
                    className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                  >
                    Also from meta
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </div>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* SideBar Search */}
      <Sidebar
        className={`
    fixed left-0 top-0 h-screen w-110 bg-white
    transition-transform duration-300 ease-in-out z-101
    ${openSearch ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <div className="px-10 py-8 flex flex-col flex-1">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Search</h1>
            <button
              className="mt-1"
              onClick={() => (setOpenSearch(false), setClick(false))}
            >
              <X />
            </button>
          </div>
          <input
            type="search"
            className="border bg-gray-100 px-4 py-3 w-[100%] outline-none mt-8 rounded-full"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search"
          />
          <div className="mt-3">
            {value.trim().length > 0 ? (
              // ===== SEARCH RESULT =====
              data?.data?.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    addSearchHistoryMutation.mutate({
                      searchedUserId: item._id,
                      searchQuery: debouncedValue,
                    });

                    setValue("");
                    setOpenSearch(false);
                    navigate(`/users/${item._id}`);
                  }}
                  className="mt-2 flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={`https://instagram.f8team.dev${item.profilePicture}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="w-[72%]">
                    <h1 className="font-semibold text-[12px]">
                      {item.username}
                    </h1>
                    <p className="text-[14px] text-gray-400">{item.fullName}</p>
                  </div>
                </div>
              ))
            ) : (
              // ===== SEARCH HISTORY =====
              <div>
                <div className="flex justify-between px-1 mb-2">
                  <h1 className="font-semibold">Mới đây</h1>
                  <button
                    className="text-sm text-blue-500"
                    onClick={() => clearAllSearchMutation.mutate()}
                  >
                    Xóa tất cả
                  </button>
                </div>

                {historyData?.data?.length === 0 ? (
                  <p className="text-sm text-gray-400 px-1">Chưa có tìm kiếm</p>
                ) : (
                  historyData?.data.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setOpenSearch(false);
                        navigate(`/users/${item.searchedUserId._id}`);
                      }}
                      className="mt-2 flex items-center gap-3 cursor-pointer"
                    >
                      <div>
                        <img
                          src={`https://instagram.f8team.dev${item.profilePicture}`}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="w-[72%]">
                          <h1 className="font-semibold text-[12px]">
                            {item?.searchedUserId?.fullName}
                          </h1>
                          <p className="text-[14px] text-gray-400">
                            {item?.searchedUserId?.username}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // tránh navigate
                            deleteSearchMutation.mutate(item._id);
                          }}
                          className="text-sm text-gray-400 hover:text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </Sidebar>

      {/* SideBar Notification */}
      <Sidebar
        className={`
    fixed left-0 top-0 h-screen w-110 bg-white
    transition-transform duration-300 ease-in-out z-101
    ${openNotifications ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <div className="px-10 py-8 flex flex-col flex-1">
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <button
              className="mt-1"
              onClick={() => (setOpenNotifications(false), setClick(false))}
            >
              <X />
            </button>
          </div>
          <h1 className="my-4 text-xl font-bold">Recent</h1>
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-xl text-gray-400">No recent searches.</h1>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

import { NavLink, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { type SearchHistoryItem } from "@/types/search";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
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
import CreatePost from "@/pages/SelectionPage/CreatePost";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSearchHistory,
  deleteAllSearch,
  deleteSearch,
  getSearchHistory,
  searchUser,
} from "@/service/search";
import type { SearchUserResponse } from "@/types/search";

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
      void navigate("/login"); // thieu replace
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
      console.log(res);
      queryClient.setQueryData<SearchUserResponse>(["searchHistory"], (old) => {
        if (old == null) return old;

        return {
          ...old,
          data: [res, ...old.data],
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
  const deleteSearchMutation = useMutation<
    void,
    Error,
    string,
    { previousData?: SearchHistoryItem[] }
  >({
    mutationFn: async (historyId: string) => {
      const token = localStorage.getItem("access_token");

      if (token === null) {
        throw new Error("No access token");
      }

      return deleteSearch(token, historyId);
    },

    onMutate: async (historyId) => {
      await queryClient.cancelQueries({ queryKey: ["searchHistory"] });

      const previousData = queryClient.getQueryData<SearchHistoryItem[]>([
        "searchHistory",
      ]);

      queryClient.setQueryData<SearchHistoryItem[]>(
        ["searchHistory"],
        (old) => {
          if (!old) return old;
          return old.filter((item) => item._id !== historyId);
        },
      );

      return { previousData };
    },

    onError: (_err, _historyId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["searchHistory"], context.previousData);
      }
    },

    onSuccess: () => {
      toast.success("Đã xóa lịch sử tìm kiếm");
    },
  });

  //Delete all

  const clearAllSearchMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("access_token");
      if (token === null) throw new Error("No token");

      return deleteAllSearch(token);
    },

    onSuccess: () => {
      queryClient.setQueryData<SearchHistoryItem[]>(["searchHistory"], []);

      toast.success("Đã xóa toàn bộ lịch sử tìm kiếm");
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
              data?.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    addSearchHistoryMutation.mutate({
                      searchedUserId: item._id,
                      searchQuery: debouncedValue,
                    });

                    setValue("");
                    setOpenSearch(false);
                    void navigate(`/users/${item._id}`);
                  }}
                  className="mt-2 flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={
                      item.profilePicture !== null
                        ? `https://instagram.f8team.dev${item.profilePicture}`
                        : "data:image/png;base64,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"
                    }
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

                {historyData?.length === 0 ? (
                  <p className="text-sm text-gray-400 px-1">Chưa có tìm kiếm</p>
                ) : (
                  historyData?.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setOpenSearch(false);
                        void navigate(`/users/${item.searchedUserId._id}`);
                      }}
                      className="mt-2 flex items-center gap-3 cursor-pointer"
                    >
                      <div>
                        <img
                          src={
                            item.searchedUserId.profilePicture !== null
                              ? `https://instagram.f8team.dev${item.searchedUserId.profilePicture}`
                              : "data:image/png;base64,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"
                          }
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="w-[72%]">
                          <h1 className="font-semibold text-[12px]">
                            {item.searchedUserId.fullName}
                          </h1>
                          <p className="text-[14px] text-gray-400">
                            {item.searchedUserId.username}
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

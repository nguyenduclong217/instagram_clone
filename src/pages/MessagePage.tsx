import { Button } from "@/components/ui/button";
import { SquarePen, Send, ChevronDown, Camera } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Footer from "./Footer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrGetConversation,
  getMessageConversation,
  getSearchMessage,
  getUnreadCount,
  readMessage,
  sendImageMes,
  sendTextMes,
} from "@/service/message";

import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useNavigate, useParams } from "react-router-dom";
import { searchUser } from "@/service/search";
import { useEffect, useMemo, useRef, useState } from "react";
import { userAuthStore } from "@/types/user.type";
import type {
  Conversation,
  Message,
  MessResponse,
  ReadMessage,
} from "@/types/message.type";
import {
  offReceiveMessage,
  onReceiveMessage,
} from "@/socket-server/chat.socket";
export default function MessagePage() {
  const { data } = useQuery({
    queryKey: ["searchMessage"],
    queryFn: () => getSearchMessage(),
  });

  // search
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Id User
  const idUser = userAuthStore((s) => s.user?._id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const { data: search } = useQuery({
    queryKey: ["searchUser", debouncedValue],
    queryFn: () => searchUser(debouncedValue),
    enabled: !!debouncedValue.trim(),
  });

  const { conversationId } = useParams<{ conversationId: string }>();
  console.log(conversationId);

  // lay thong tin cuoc tro chuyen
  const { data: messageData } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      getMessageConversation(
        localStorage.getItem("access_token")!,
        conversationId!,
      ),
    enabled: conversationId !== undefined,
  });
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageData?.messages]);

  const profile = useMemo(() => {
    if (conversationId == null || data == null || idUser == null) return null;

    const currentConv = data.conversations.find(
      (c) => c._id === conversationId,
    );

    if (!currentConv) return null;

    // lấy người còn lại
    const otherUser = currentConv.participants.find((p) => p._id !== idUser);

    if (!otherUser) return null;

    return {
      id: otherUser._id,
      name: otherUser.fullName,
      avatar: otherUser.profilePicture,
    };
  }, [conversationId, data, idUser]);

  console.log(profile);

  useEffect(() => {
    if (messageData?.messages) {
      setMessages(messageData.messages);
    }
  }, [messageData]);
  console.log(profile);

  // console.log(messageData);
  const queryClient = useQueryClient();
  const navigator = useNavigate();

  const createConversationMutation = useMutation({
    mutationFn: (userId: string) => {
      const token = localStorage.getItem("access_token")!;
      return createOrGetConversation(token, userId);
    },

    onSuccess: async (res) => {
      const conversationId = res._id;

      //REFRESH LIST CHAT
      await queryClient.invalidateQueries({
        queryKey: ["searchMessage"],
      });

      // đóng search
      setOpenSearch(false);
      setValue("");
      setDebouncedValue("");

      // chuyển trang chat
      void navigator(`/direct/${conversationId}`);
    },
  });

  const id = userAuthStore((s) => s.user?._id);
  console.log(data);
  console.log(messages);

  // Send message
  const [content, setContent] = useState("");
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const recipientId = profile?.id;
  const handleSendMessage = async () => {
    if (conversationId === undefined || recipientId === undefined) return;

    const token = localStorage.getItem("access_token")!;
    let res;
    try {
      if (imageFile) {
        res = await sendImageMes(token, conversationId, recipientId, imageFile);

        setImageFile(null);
        setPreviewImage(null);
      }
      // 👉 TEXT
      else if (content.trim()) {
        res = await sendTextMes(token, conversationId, recipientId, content);

        setContent("");
      } else {
        return;
      }
      // append message
      setMessages((prev) => [...prev, res]);
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  useEffect(() => {
    onReceiveMessage((msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
    return () => offReceiveMessage();
  }, [conversationId]);

  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => {
      const token = localStorage.getItem("access_token")!;
      return getUnreadCount(token);
    },
  });
  console.log(unreadData);

  // ReadMessage

  const markConversationRead = useMutation<
    { conversationId: string },
    Error,
    string
  >({
    mutationFn: (conversationId: string) => {
      const accessToken = localStorage.getItem("access_token")!;
      return readMessage(accessToken, conversationId);
    },

    onSuccess: async (_, convId) => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", convId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["unreadCount"],
      });
    },
  });

  useEffect(() => {
    if (conversationId === undefined) return;

    markConversationRead.mutate(conversationId);
  }, [conversationId]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className=" flex h-screen">
      <div className="w-[30%] pt-7 px-2 flex flex-col h-full border-r">
        <div className="py-4 px-2 flex justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-semibold">Meoo Meoo</h1>

            <Dialog>
              <DialogTrigger asChild>
                <ChevronDown size={17} className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="w-150 p-10">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
                  alt=""
                  className="w-40 my-6 mx-auto"
                />
                <form className="mx-auto">
                  <input
                    type="text"
                    placeholder="Phone number, username, or email"
                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 mt-3"
                  />

                  {/* Checkbox */}
                  <div className="flex items-center gap-1 w-full text-sm mt-2">
                    <input type="checkbox" id="save-login" />
                    <label
                      htmlFor="save-login"
                      className="ml-2 text-sm cursor-pointer select-none"
                    >
                      Save login info
                    </label>
                  </div>

                  {/* Button */}
                  <Button className="w-full bg-blue-500 text-white py-2 mt-3 rounded-md font-semibold hover:bg-blue-600">
                    Log in
                  </Button>

                  {/* Link */}
                  <p className="text-sm cursor-pointer hover:underline text-center mt-5">
                    Forgot password?
                  </p>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Dialog open={openSearch} onOpenChange={setOpenSearch}>
            <DialogTrigger asChild>
              <SquarePen
                className="cursor-pointer"
                onClick={() => setOpenSearch(true)}
              />
            </DialogTrigger>
            <DialogContent className="w-170 top-[120px] translate-y-0 left-1/2 -translate-x-1/2 p-4">
              <h1 className="text-center font-semibold  h-10">New message</h1>
              <div>
                <div className="flex gap-2 border-y py-2">
                  <h1 className="font-semibold">To:</h1>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 px-2 py- outline-none"
                    placeholder="Search..."
                  />
                </div>
                <h1 className="font-semibold mt-3">Suggested</h1>
                <div className="h-50 overflow-y-scroll">
                  {search?.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        createConversationMutation.mutate(item._id);
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
                        <p className="text-[14px] text-gray-400">
                          {item.fullName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-blue-400 hover:bg-blue-600">
                  Chat
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-2 px-5 rounded-full bg-gray-100 outline-none"
        />

        {/* List message user */}
        <div className="flex flex-col h-[80%]">
          <div className="flex justify-between mt-4">
            <h1 className="text-[18px] font-semibold">Message</h1>
            <p className="text-gray-500">Requests</p>
          </div>
          <div className="flex-1 overflow-y-scroll">
            {data?.conversations.map((conv) => {
              const otherUser = conv.participants.find((p) => p._id !== id);

              if (!otherUser) return null;
              return (
                <div
                  key={conv._id}
                  onClick={() => (
                    void navigator(`/direct/${conv._id}`),
                    markConversationRead.mutate(conv._id)
                  )}
                  className="relative flex gap-3 items-center hover:bg-gray-100 p-2 cursor-pointer"
                >
                  {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                    <p className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                      {conv.unreadCount}
                    </p>
                  )}
                  <img
                    src={`https://instagram.f8team.dev${otherUser.profilePicture}`}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <h1 className="text-[13px] font-semibold">
                      {otherUser.fullName}
                    </h1>
                    <p className="text-[13px] text-gray-400">
                      Bắt đầu trò chuyện -{dayjs(conv.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Your avatar */}
      <div className="w-[70%]">
        {messageData ? (
          <div className="h-screen w-full flex flex-col">
            <div className="shrink-0 flex gap-3 items-center p-3 border-b bg-white">
              <img
                src={`https://instagram.f8team.dev${profile?.avatar}`}
                alt=""
                className="w-14 h-14 rounded-full object-cover"
              />

              <div>
                <h1 className="text-[13px] font-semibold">{profile?.name}</h1>
                <p className="text-[13px] text-gray-400">
                  {/* Bắt đầu trò chuyện -{dayjs(conv.createdAt).fromNow()} */}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
              {messages.map((item) => (
                <div key={item._id} className="w-full px-4 py-2">
                  {item.senderId._id !== idUser ? (
                    <div className="flex gap-2 items-end">
                      <img
                        src={`https://instagram.f8team.dev${item.senderId.profilePicture}`}
                        className="w-8 h-8 rounded-full"
                      />

                      {item.messageType === "image" ? (
                        <img
                          src={`https://instagram.f8team.dev${item.imageUrl}`}
                          className="max-w-[220px] rounded-xl"
                        />
                      ) : (
                        <p className="bg-gray-200 px-4 py-2 rounded-2xl">
                          {item.content}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      {item.messageType === "image" ? (
                        <img
                          src={`https://instagram.f8team.dev${item.imageUrl}`}
                          className="max-w-[220px] rounded-xl"
                        />
                      ) : (
                        <p className="bg-blue-600 text-white px-4 py-2 rounded-2xl">
                          {item.content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSendMessage();
              }}
              className="shrink-0 border-t p-3 bg-white"
            >
              <div className="flex items-center ">
                {previewImage !== null && (
                  <div className="relative w-fit mb-2">
                    <img
                      src={previewImage}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    {/* nút huỷ */}
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setImageFile(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={28} />
                </button>

                <div className="flex items-center gap-3 w-[93%]">
                  <input
                    type="text"
                    placeholder="Nhắn tin..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-[100%] border rounded-full px-4 py-2 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => void handleSendMessage()}
                    className="text-blue-500 font-semibold"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen flex-col gap-2">
            <div className="border rounded-full w-fit border-black">
              <Send size={60} className="m-3" />
            </div>
            <h1 className="text-[22px]">Your messages</h1>
            <p className="text-gray-500">Send a message to start a chat.</p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                  Send message
                </Button>
              </DialogTrigger>
              <DialogContent className="w-170 top-[120px] translate-y-0 left-1/2 -translate-x-1/2 p-4">
                <h1 className="text-center font-semibold  h-10">New message</h1>
                <div>
                  <div className="flex gap-2 border-y py-2">
                    <h1 className="font-semibold">To:</h1>
                    <input
                      type="text"
                      className="flex-1 px-2 py- outline-none"
                      placeholder="Search..."
                    />
                  </div>
                  <h1 className="font-semibold mt-3">Suggested</h1>
                  <div className="h-50 overflow-y-scroll">
                    <div className="flex gap-3 items-center hover:bg-gray-100 p-1">
                      <img
                        src=""
                        alt=""
                        className="w-14 h-14 rounded-full bg-gray-400"
                      />
                      <div>
                        <h1 className="text-[13px]">ddddd</h1>
                        <p className="text-[13px] text-gray-400">
                          Active 5h ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-400 hover:bg-blue-600">
                    Chat
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}

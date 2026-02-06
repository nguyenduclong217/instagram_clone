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
  sendImageMes,
  sendTextMes,
} from "@/service/message";
import { useAuthStore } from "@/stores/infoUser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useNavigate, useParams } from "react-router-dom";
import { searchUser } from "@/service/search";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [messages, setMessages] = useState<any[]>([]);

  // Id User
  const idUser = useAuthStore((s) => s.user?._id);

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
        conversationId,
      ),
    enabled: !!conversationId,
  });
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageData?.data?.messages]);

  const profile = useMemo(() => {
    if (!conversationId || !data?.data?.conversations || !idUser) return null;

    const currentConv = data.data.conversations.find(
      (c: any) => c._id === conversationId,
    );

    if (!currentConv) return null;

    // lấy người còn lại
    const otherUser = currentConv.participants.find(
      (p: any) => p._id !== idUser,
    );

    if (!otherUser) return null;

    return {
      id: otherUser._id,
      name: otherUser.fullName,
      avatar: otherUser.profilePicture,
    };
  }, [conversationId, data, idUser]);

  useEffect(() => {
    if (messageData?.data?.messages) {
      setMessages(messageData.data.messages);
    }
  }, [messageData]);
  console.log(profile);

  console.log(messageData);
  const queryClient = useQueryClient();
  const navigator = useNavigate();

  const createConversationMutation = useMutation({
    mutationFn: (userId: string) => {
      const token = localStorage.getItem("access_token")!;
      return createOrGetConversation(token, userId);
    },

    onSuccess: (res) => {
      const conversationId = res.data._id;

      //REFRESH LIST CHAT
      queryClient.invalidateQueries({
        queryKey: ["searchMessage"],
      });

      // đóng search
      setOpenSearch(false);
      setValue("");
      setDebouncedValue("");

      // chuyển trang chat
      navigator(`/direct/${conversationId}`);
    },
  });

  const id = useAuthStore((s) => s.user?._id);
  console.log(data);

  // Send message
  const [content, setContent] = useState("");
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const recipientId = profile?.id;
  const handleSendMessage = async () => {
    if (!conversationId || !recipientId) return;

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
      setMessages((prev) => [...prev, res.data]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

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
                  {search?.data?.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        createConversationMutation.mutate(item._id);
                      }}
                      className="mt-2 flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={`https://instagram.f8team.dev${item?.profilePicture}`}
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
            {data?.data?.conversations?.map((conv) => {
              const otherUser = conv.participants.find(
                (p: any) => p._id !== id,
              );

              if (!otherUser) return null;
              return (
                <div
                  key={conv._id}
                  onClick={() => navigator(`/direct/${conv._id}`)}
                  className="flex gap-3 items-center hover:bg-gray-100 p-2 cursor-pointer"
                >
                  <img
                    src={`https://instagram.f8team.dev${otherUser?.profilePicture}`}
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
                // src={`https://instagram.f8team.dev${profile?.avatar}`}
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
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-end">
              {/* {messageData?.data?.messages?.map((item) => (
                <div className="w-full px-4 py-2">
                  {item?.senderId?._id !== idUser && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-2 max-w-[70%]">
                        <img
                          src={`https://instagram.f8team.dev${item?.senderId?.profilePicture}`}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {item.messageType === "image" && (
                          <img
                            src={`https://instagram.f8team.dev${item.imageUrl}`}
                            className="max-w-[220px] rounded-xl"
                          />
                        )}

                        {item.messageType === "text" && (
                          <p className="text-sm bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none break-words">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {item?.senderId?._id === idUser && (
                    <div className="flex justify-end">
                      <div className="max-w-[70%]">
                        {item.messageType === "image" && (
                          <img
                            src={`https://instagram.f8team.dev${item.imageUrl}`}
                            className="max-w-[220px] rounded-xl"
                          />
                        )}

                        {item.messageType === "text" && (
                          <p className="text-sm bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-bl-none break-words">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))} */}
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
                handleSendMessage();
              }}
              className="shrink-0 border-t p-3 bg-white"
            >
              <div className="flex items-center ">
                {previewImage && (
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
                    onClick={handleSendMessage}
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

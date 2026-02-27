import type { Message } from "@/types/message.type";
import { getSocket } from "./socket";

export const joinConversation = (conversationId: string) => {
  const socket = getSocket();

  socket?.emit("Join-conversation", conversationId);
};

// Gui tin nhan


// Nhan tin nhan
export const onReceiveMessage = (callback: (msg: Message) => void) => {
  const socket = getSocket();

  socket?.on("new_message", (message: Message) => {
    callback(message);
  });
};

export const offReceiveMessage = () => {
  const socket = getSocket();
  socket?.off("receive-message");
};

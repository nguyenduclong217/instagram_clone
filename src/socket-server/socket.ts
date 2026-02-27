import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (accessToken: string): Socket => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_BASE_URL as string, {
    auth: {
      token: accessToken,
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to chat server", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnect:", reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


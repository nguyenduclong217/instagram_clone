export interface Participant {
  _id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}

export interface LastMessage {
  _id: string;
  messageType: string;
  content: string;
  createdAt: string;
  senderId: string;
  isRead: boolean;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage: LastMessage | null;
  lastMessageAt: string;
  unreadCount?: number;
  createdAt: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalConversations: number;
    hasMore: boolean;
  };
}

export interface MessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: Participant;
  recipientId: string;
  messageType: "text" | "image";
  content?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessagePagination {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: MessagePagination;
}
// useEffect(() => {
//   socket.on("newMessage", (newMessage: Message) => {
//     queryClient.setQueryData(
//       ["messages", conversationId],
//       (oldData: MessagesResponse | undefined) => {
//         if (!oldData) return oldData;

//         return {
//           ...oldData,
//           messages: [...oldData.messages, newMessage],
//         };
//       }
//     );
//   });

//   return () => socket.off("newMessage");
// }, [conversationId]);

export interface TextMessage {
  _id: string;
  conversationId: string;
  senderId: Participant;
  recipientId: string;
  messageType: "text";
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ImageMessage {
  _id: string;
  conversationId: string;
  senderId: Participant;
  recipientId: string;
  messageType: "image";
  imageUrl: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReadMessage {
  _id: string;
  isRead: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// Get Conversations

import instance from "@/pages/utils/axios";
import {
  UnreadCountResponse,
  type Conversation,
  type ConversationsResponse,
  type ImageMessage,
  type MessagesResponse,
  type MessResponse,
  type ReadMessage,
  type TextMessage,
} from "@/types/message.type";

export const getSearchMessage = async (): Promise<ConversationsResponse> => {
  const response = await instance.get<{
    success: boolean;
    message: string;
    data: ConversationsResponse;
  }>("/api/messages/conversations");

  return response.data.data;
};

// service/message.ts
export const createOrGetConversation = async (
  token: string,
  userId: string,
): Promise<Conversation> => {
  const res = await instance.post<MessResponse<Conversation>>(
    "/api/messages/conversations",
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data.data;
};

// Get Messages in Conversation

export const getMessageConversation = async (
  token: string,
  conversationId: string,
): Promise<MessagesResponse> => {
  const res = await instance.get<MessResponse<MessagesResponse>>(
    `/api/messages/conversations/${conversationId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data.data;
};

// Send Text Message

export const sendTextMes = async (
  accessToken: string,
  conversationId: string,
  recipientId: string,
  content: string,
): Promise<TextMessage> => {
  const response = await instance.post<MessResponse<TextMessage>>(
    `/api/messages/messages`,
    {
      conversationId,
      recipientId,
      messageType: "text",
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data.data;
};

// Send Image Message

export const sendImageMes = async (
  accessToken: string,
  conversationId: string,
  recipientId: string,
  file: File,
): Promise<ImageMessage> => {
  const formData = new FormData();

  formData.append("conversationId", conversationId);
  formData.append("recipientId", recipientId);
  formData.append("messageType", "image");
  formData.append("image", file);

  const response = await instance.post<MessResponse<ImageMessage>>(
    "/api/messages/messages",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data.data;
};

// ReadMessage

export const readMessage = async (
  accessToken: string,
  conversationId: string,
): Promise<ReadMessage> => {
  const response = await instance.put<MessResponse<ReadMessage>>(
    `/api/messages/messages/${conversationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data.data;
};

// unreadCount

export const getUnreadCount = async (
  accessToken: string,
): Promise<UnreadCountResponse> => {
  const response = await instance.get<MessResponse<UnreadCountResponse>>(
    `/api/messages/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data.data;
};

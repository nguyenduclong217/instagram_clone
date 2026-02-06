// Get Conversations

import instance from "@/pages/utils/axios";

export const getSearchMessage = async () => {
  try {
    const response = await instance.get(`/api/messages/conversations`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// service/message.ts
export const createOrGetConversation = async (
  token: string,
  userId: string,
) => {
  const res = await instance.post(
    "/api/messages/conversations",
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

// Get Messages in Conversation

export const getMessageConversation = async (
  token: string,
  conversationId: string,
) => {
  const res = await instance.get(
    `/api/messages/conversations/${conversationId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

// Send Text Message

export const sendTextMes = async (
  accessToken: string,
  conversationId: string,
  recipientId: string,
  content: string,
) => {
  const response = await instance.post(
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

  return response.data;
};

// Send Image Message

export const sendImageMes = async (
  accessToken: string,
  conversationId: string,
  recipientId: string,
  file: File,
) => {
  const formData = new FormData();

  formData.append("conversationId", conversationId);
  formData.append("recipientId", recipientId);
  formData.append("messageType", "image");
  formData.append("image", file);

  const response = await instance.post("/api/messages/messages", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

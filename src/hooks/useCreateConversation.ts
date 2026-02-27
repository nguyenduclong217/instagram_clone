import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrGetConversation } from "@/service/message";
import { useNavigate } from "react-router-dom";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userId: string) => {
      const token = localStorage.getItem("access_token")!;
      return createOrGetConversation(token, userId);
    },

    onSuccess: async (res) => {
      const conversationId = res._id;

      await queryClient.invalidateQueries({
        queryKey: ["searchMessage"],
      });

      void navigate(`/direct/${conversationId}`);
    },
  });
};

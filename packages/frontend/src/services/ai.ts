import { useMutation } from "@tanstack/react-query";

import useShowAPIErrorMessage from "@/hooks/api/ShowAPIErrorMessage";
import store from "@/store";

const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/ai`;

export function useSummarizeEmail() {
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: async (emailId: string) => {
      // Note: Using fetch instead of axios because Axios doesn't support streaming in browsers
      // and the backend streams the AI-generated summary
      const { accessToken } = store.getState().auth;
      const response = await fetch(`${baseURL}/summarize-email/${emailId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Mimic Axios error structure for compatibility with useShowAPIErrorMessage
        throw {
          response: {
            data: errorData,
          },
          message: errorData.message || "Failed to fetch summary",
        };
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      return response.body.getReader();
    },
    onError: showAPIErrorMessage,
  });
}

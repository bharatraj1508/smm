import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import useShowAPIErrorMessage from "@/hooks/api/ShowAPIErrorMessage";
import { Settings } from "@/store/types/settings";

const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/settings`;

export const settingsKeys = {
  all: ["settings"] as const,
};

export const useGetSettings = () => {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => {
      const { data } = await axios.get<Settings>("/", {
        baseURL,
        withCredentials: true,
      });
      return data;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: async (settings: Partial<Settings>) => {
      const { data } = await axios.put("/", settings, {
        baseURL,
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["gmail", "SyncCount"] });
    },
    onError: showAPIErrorMessage,
  });
};

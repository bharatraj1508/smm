import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import useShowAPIErrorMessage from "@/hooks/api/ShowAPIErrorMessage";
import {
  EmailQueryParams,
  GetEmailsResponse,
  SyncCountResponse,
} from "@/store/types/gmail";

const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/gmail`;

export function useGmailLabels() {
  return useQuery({
    queryKey: ["gmail", "labels"],
    async queryFn() {
      const apiUrl = "/labels";

      const { data } = await axios.get(apiUrl, {
        baseURL,
      });
      return data;
    },
  });
}

export function useGmailMessages({
  page = 1,
  maxResults = 10,
}: EmailQueryParams) {
  return useQuery({
    queryKey: ["gmail", "messsages", page],
    async queryFn() {
      const params = `page=${page}&maxResults=${maxResults}`;
      const apiUrl = "/emails?" + params;
      const { data } = await axios.get<GetEmailsResponse>(apiUrl, {
        baseURL,
      });
      return data;
    },
  });
}

export function useEmailSyncCount() {
  return useQuery({
    queryKey: ["gmail", "SyncCount"],
    async queryFn() {
      const apiUrl = "/sync-count";
      const { data } = await axios.get<SyncCountResponse>(apiUrl, {
        baseURL,
      });
      return data;
    },
  });
}

export function useSyncMails() {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(payload: EmailQueryParams) {
      return axios.post("/initiate-sync", payload, {
        baseURL,
        withCredentials: true,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["gmail", "SyncCount"] });
      queryClient.invalidateQueries({ queryKey: ["gmail", "labels"] });
      queryClient.invalidateQueries({ queryKey: ["gmail", "messages"] });
    },
    onError: showAPIErrorMessage,
  });
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

import { AxiosError } from "axios";
import { toast } from "sonner";

export type APIError = AxiosError<{ message: string }>;

export default function useShowAPIErrorMessage() {
  return (error: APIError) => {
    if (!error) {
      toast.error("An unexpected error occurred");
      return;
    }

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === "string" ? error : "An unexpected error occurred");
    console.log("errorMessage", errorMessage);
    toast.error(errorMessage);
  };
}

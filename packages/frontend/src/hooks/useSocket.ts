"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

import store from "@/store";
import useStoreSelector from "@/store/hooks/useStoreSelector";
import { setConnected, setDisconnected } from "@/store/slices/socket";


export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const accessToken = useStoreSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    if (!socketRef.current) {
      const socketUrl =
        process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3002";

      socketRef.current = io(socketUrl, {
        auth: { token: accessToken },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        store.dispatch(setConnected());
      });

      socketRef.current.on("sync:complete", (data: { count: number }) => {
        toast.success(`Sync complete! Found ${data.count} new emails.`);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["gmail"] });
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        store.dispatch(setDisconnected());
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        store.dispatch(setDisconnected());
        socketRef.current = null;
      }
    };
  }, [accessToken, queryClient]);

  return socketRef.current;
};

"use client";

import useStoreSelector from "@/store/hooks/useStoreSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SocketIndicator = () => {
  const isConnected = useStoreSelector((state) => state.socket.isConnected);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              isConnected ? "bg-emerald-500/10" : "bg-rose-500/10"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isConnected
              ? "Real time updates are active"
              : "Connection to server is not active. Retrying connection..."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

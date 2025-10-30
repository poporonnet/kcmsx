import { useEffect, useRef } from "react";
import { EnhancedWebSocket } from "../libs/enhancedWebSocket";

export const useWebSocket = (
  url: string,
  listener?: {
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onReconnect?: (event: Event) => void;
  },
  protocols?: string
) => {
  const wsRef = useRef<EnhancedWebSocket>(undefined);
  const listenerRef = useRef(listener);

  useEffect(() => {
    const ws = new EnhancedWebSocket(url, protocols);
    wsRef.current = ws;

    ws.addEventListener("open", (event: Event) =>
      listenerRef.current?.onOpen?.(event)
    );
    ws.addEventListener("message", (event: MessageEvent) =>
      listenerRef.current?.onMessage?.(event)
    );
    ws.addEventListener("error", (event: Event) =>
      listenerRef.current?.onError?.(event)
    );
    ws.addEventListener("close", (event: CloseEvent) =>
      listenerRef.current?.onClose?.(event)
    );
    ws.addEventListener("reconnect", (event: Event) =>
      listenerRef.current?.onReconnect?.(event)
    );

    ws.connect();

    return () => ws.disconnect();
  }, [url, protocols]);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  return wsRef;
};

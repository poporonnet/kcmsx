import { useEffect, useRef } from "react";

export const useWebSocket = (
  url: string,
  listener: {
    onOpen?: (event: Event) => any;
    onMessage?: (event: MessageEvent) => any;
    onError?: (event: Event) => any;
    onClose?: (event: CloseEvent) => any;
  },
  protocols?: string
) => {
  const wsRef = useRef<WebSocket>(undefined);

  useEffect(() => {
    const { onOpen, onMessage, onError, onClose } = listener;

    wsRef.current = new WebSocket(url, protocols);

    if (onOpen) wsRef.current.addEventListener("open", onOpen);
    if (onMessage) wsRef.current.addEventListener("message", onMessage);
    if (onError) wsRef.current.addEventListener("error", onError);
    if (onClose) wsRef.current.addEventListener("close", onClose);

    return () => {
      if (onOpen) wsRef.current?.removeEventListener("open", onOpen);
      if (onMessage) wsRef.current?.removeEventListener("message", onMessage);
      if (onError) wsRef.current?.removeEventListener("error", onError);
      if (onClose) wsRef.current?.removeEventListener("close", onClose);

      wsRef.current?.close();
    };
  }, []);

  return wsRef;
};

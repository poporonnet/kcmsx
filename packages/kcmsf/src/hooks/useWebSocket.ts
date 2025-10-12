import { useCallback, useEffect, useRef } from "react";

export const useWebSocket = (
  url: string,
  listener: {
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
  },
  protocols?: string
) => {
  const wsRef = useRef<WebSocket>(undefined);
  const listenerRef = useRef(listener);

  const onOpen = (event: Event) => listenerRef.current.onOpen?.(event);
  const onMessage = (event: MessageEvent) =>
    listenerRef.current.onMessage?.(event);
  const onError = (event: Event) => listenerRef.current.onError?.(event);
  const onClose = (event: CloseEvent) => listenerRef.current.onClose?.(event);

  const register = useCallback(() => {

    wsRef.current = new WebSocket(url, protocols);

    wsRef.current.addEventListener("open", onOpen);
    wsRef.current.addEventListener("message", onMessage);
    wsRef.current.addEventListener("error", onError);
    wsRef.current.addEventListener("close", onClose);
  }, [url, protocols]);

  const unregister = useCallback(() => {
    wsRef.current?.removeEventListener("open", onOpen);
    wsRef.current?.removeEventListener("message", onMessage);
    wsRef.current?.removeEventListener("error", onError);
    wsRef.current?.removeEventListener("close", onClose);

    wsRef.current?.close();
  }, []);

  useEffect(() => {
    register();

    return unregister;
  }, [register, unregister]);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  return wsRef;
};

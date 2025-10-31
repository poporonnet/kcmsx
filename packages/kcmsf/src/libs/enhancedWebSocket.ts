type EventMap = {
  close: CloseEvent;
  error: Event;
  message: MessageEvent<string>;
  open: Event;
  reconnect: Event;
};

type EventKey = keyof EventMap;

const reconnectDelayMs = 3000;

export class EnhancedWebSocket {
  private ws?: WebSocket;
  private readonly eventTarget: EventTarget;

  private isInitialized: boolean;
  private isConnecting: boolean;
  private isDisconnecting: boolean;
  private unregister?: () => void;

  constructor(
    private readonly url: string | URL,
    private readonly protocols?: string | string[]
  ) {
    this.eventTarget = new EventTarget();
    this.isInitialized = false;
    this.isConnecting = false;
    this.isDisconnecting = false;
  }

  async connect(): Promise<void> {
    if (
      this.ws?.readyState === WebSocket.OPEN ||
      this.ws?.readyState === WebSocket.CONNECTING ||
      this.isConnecting
    )
      return;

    this.isConnecting = true;

    try {
      await this.initializeWebSocket();
    } catch (error) {
      console.error(
        new Error("An error occurred while initializing WebSocket", {
          cause: error,
        })
      );
    }

    this.isConnecting = false;
  }

  disconnect(): void {
    if (
      this.ws?.readyState === WebSocket.CLOSED ||
      this.ws?.readyState === WebSocket.CLOSING ||
      this.isDisconnecting
    )
      return;

    this.isDisconnecting = true;

    this.unregister?.();
    this.ws?.close();
    this.ws = undefined;

    this.isDisconnecting = false;
  }

  async reconnect(): Promise<void> {
    this.disconnect();
    return this.connect();
  }

  addEventListener<Key extends EventKey>(
    type: Key,
    listener: (event: EventMap[Key]) => void,
    options?: Parameters<EventTarget["addEventListener"]>["2"]
  ): void {
    this.eventTarget.addEventListener(type, listener as EventListener, options);
  }

  removeEventListener<Key extends EventKey>(
    type: Key,
    listener: (event: EventMap[Key]) => void,
    options?: Parameters<EventTarget["removeEventListener"]>["2"]
  ): void {
    this.eventTarget.removeEventListener(
      type,
      listener as EventListener,
      options
    );
  }

  send(data: Parameters<WebSocket["send"]>[0]) {
    if (!this.ws) throw new Error("Connection is not established yet.");
    if (this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(data);
  }

  private async initializeWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url, this.protocols);
      this.ws = ws;

      const onOpen = () => {
        resolve();
        this.eventTarget.dispatchEvent(new Event("open" satisfies EventKey));
        if (this.isInitialized) {
          this.eventTarget.dispatchEvent(
            new Event("reconnect" satisfies EventKey)
          );
        }
        this.isInitialized = true;
      };
      const onError = (event: Event) => {
        reject(event);
        this.eventTarget.dispatchEvent(new Event("error" satisfies EventKey));
      };
      const onMessage = (event: MessageEvent) => {
        this.eventTarget.dispatchEvent(
          new MessageEvent("message" satisfies EventKey, { data: event.data })
        );
      };
      const onClose = (event: CloseEvent) => {
        if (this.isDisconnecting) {
          resolve();
        } else {
          reject(event);
          setTimeout(() => this.reconnect(), reconnectDelayMs);
        }
        this.eventTarget.dispatchEvent(
          new CloseEvent("close" satisfies EventKey)
        );
      };

      this.unregister = () => {
        ws.removeEventListener("open", onOpen);
        ws.removeEventListener("error", onError);
        ws.removeEventListener("message", onMessage);
        ws.removeEventListener("close", onClose);
      };

      ws.addEventListener("open", onOpen);
      ws.addEventListener("error", onError);
      ws.addEventListener("message", onMessage);
      ws.addEventListener("close", onClose);
    });
  }
}

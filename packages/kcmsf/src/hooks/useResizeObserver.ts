import { useCallback, useSyncExternalStore } from "react";

export const useResizeObserver = (target: Element | null) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const observer = new ResizeObserver((entries) =>
        entries.forEach(onStoreChange)
      );
      if (target) {
        observer.observe(target);
      }

      return () => observer.disconnect();
    },
    [target]
  );

  const width = useSyncExternalStore(
    subscribe,
    () => target?.getBoundingClientRect().width ?? 0
  );
  const height = useSyncExternalStore(
    subscribe,
    () => target?.getBoundingClientRect().height ?? 0
  );

  return { width, height };
};

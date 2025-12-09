import { RefObject, useCallback, useSyncExternalStore } from "react";

export const useResizeObserver = (targetRef: RefObject<Element | null>) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const observer = new ResizeObserver((entries) =>
        entries.forEach(onStoreChange)
      );
      if (targetRef.current) {
        observer.observe(targetRef.current);
      }

      return () => observer.disconnect();
    },
    [targetRef]
  );

  const width = useSyncExternalStore(
    subscribe,
    () => targetRef.current?.getBoundingClientRect().width ?? 0
  );
  const height = useSyncExternalStore(
    subscribe,
    () => targetRef.current?.getBoundingClientRect().height ?? 0
  );

  return { width, height };
};

import { useEffect, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "./useResizeObserver";

type Option = {
  offset?: {
    x?: number;
    y?: number;
  };
};

export const useCenterTranslate = (option: Option) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Element>(null);
  const [targetClassName, setTargetClassName] = useState<string>();

  const { width: containerWidth, height: containerHeight } =
    useResizeObserver(containerRef);
  const { height: gHeight } = useResizeObserver(targetRef);
  const translate = useMemo(
    () => ({
      x: containerWidth / 2 + (option.offset?.x ?? 0),
      y: containerHeight / 2 - gHeight / 2 + (option.offset?.y ?? 0),
    }),
    [containerWidth, containerHeight, gHeight, option]
  );

  useEffect(() => {
    targetRef.current =
      targetClassName != null
        ? document.getElementsByClassName(targetClassName)[0]
        : null;
  }, [targetClassName]);

  return { containerRef, setTargetClassName, translate };
};

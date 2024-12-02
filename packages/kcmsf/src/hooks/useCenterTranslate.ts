import { useMemo, useRef, useState } from "react";
import { useResizeObserver } from "./useResizeObserver";

type Option = {
  offset?: {
    x?: number;
    y?: number;
  };
};

export const useCenterTranslate = (option: Option) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetClassName, setTargetClassName] = useState<string>();
  const targetElement = useMemo(
    () =>
      targetClassName
        ? document.getElementsByClassName(targetClassName)[0]
        : null,
    [targetClassName]
  );

  const { width: containerWidth, height: containerHeight } = useResizeObserver(
    containerRef.current
  );
  const { height: gHeight } = useResizeObserver(targetElement);
  const translate = useMemo(
    () => ({
      x: containerWidth / 2 + (option.offset?.x ?? 0),
      y: containerHeight / 2 - gHeight / 2 + (option.offset?.y ?? 0),
    }),
    [containerWidth, containerHeight, gHeight]
  );

  return { containerRef, setTargetClassName, translate };
};

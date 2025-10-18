import { RefObject, useEffect, useRef } from "react";

export const useConsistentRef = <T>(value: T): Readonly<RefObject<T>> => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};

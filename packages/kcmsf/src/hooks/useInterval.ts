import { useEffect, useRef } from "react";

export const useInterval = (onUpdate: OnUpdate, ms: number) => {
  const onUpdateRef = useRef<OnUpdate>(() => {});
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  useEffect(() => {
    const intervalId = setInterval(() => onUpdateRef.current(), ms);
    return () => clearInterval(intervalId);
  }, [ms]);
};

type OnUpdate = () => void;

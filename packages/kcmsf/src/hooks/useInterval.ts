import { useEffect, useRef } from "react";

export const useInterval = (onUpdate: OnUpdate, ms: number, active:boolean = true) => {
  const onUpdateRef = useRef<OnUpdate>(() => {});
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  useEffect(() => {
    if (active) {
      const intervalId = setInterval(() => onUpdateRef.current(), ms);
      return () => clearInterval(intervalId);
    }
  }, [ms, active]);
};

type OnUpdate = () => void;

import { useEffect, useRef } from "react";

type Option = {
  active: boolean;
};

export const useInterval = (
  onUpdate: OnUpdate,
  ms: number,
  option: Option = { active: true }
) => {
  const onUpdateRef = useRef<OnUpdate>(() => {});
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  useEffect(() => {
    if (option.active) {
      const intervalID = setInterval(() => onUpdateRef.current(), ms);
      return () => clearInterval(intervalID);
    }
  }, [ms, option.active]);
};

type OnUpdate = () => void;

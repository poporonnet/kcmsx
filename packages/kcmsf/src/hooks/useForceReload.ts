import { useReducer } from "react";

export const useForceReload = () => {
  return useReducer((prev) => prev + 1, 0)[1];
};

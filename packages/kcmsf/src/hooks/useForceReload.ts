import { useState } from "react";

export const useForceReload = () => {
  const setId = useState(0)[1];
  return () => setId((prev) => prev + 1);
};

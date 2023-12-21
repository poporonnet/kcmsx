import { useState } from "react";

export const useForceReload = () => {
  const [_, setId] = useState(0);
  return () => setId((prev) => prev + 1);
};

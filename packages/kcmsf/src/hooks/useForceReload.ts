import { useState } from "react";

export const useForceReload = () => {
  const setID = useState(0)[1];
  return () => setID((prev) => prev + 1);
};

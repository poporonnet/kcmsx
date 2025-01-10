import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Login } from "./Login";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<boolean>();
  const check = useCallback(async (): Promise<boolean> => {
    const checkRes = await fetch(`${import.meta.env.VITE_API_URL}/`, {
      credentials: "include",
    }).catch(() => undefined);
    const res = checkRes?.ok ?? false;

    if (!res) {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`);
    }
    setAuth(res);
    return res;
  }, []);
  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        credentials: "include",
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }).catch(() => undefined);
      if (!loginRes?.ok) return false;

      return await check();
    },
    [check]
  );

  useEffect(() => {
    check();
  }, [check]);

  return (
    <AuthContext.Provider value={auth}>
      {auth ? children : <Login auth={auth} login={login} />}
    </AuthContext.Provider>
  );
};

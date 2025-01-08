import { useContext } from "react";
import { AuthContext } from "../contexts/AutoContext";

export const useAuth = () => useContext(AuthContext);

import { Outlet } from "react-router-dom";
import { Header } from "../components/header.tsx";

export const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

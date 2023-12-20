import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Layout } from "./layout.tsx";
import { Home } from "../pages/home.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { MatchList } from "../pages/matchList.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/entrylist" element={<EntryList />} />
      <Route path="/matchlist" element={<MatchList />} />
    </Route>
  ),
  {
    basename: import.meta.env.VITE_BASE_URL,
  }
);

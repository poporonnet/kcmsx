import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Layout } from "./layout.tsx";
import { Home } from "../pages/home.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { Ranking } from "../pages/ranking.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/entrylist" element={<EntryList />} />
      <Route path="/ranking" element={<Ranking />} />
    </Route>
  ),
  {
    basename: import.meta.env.VITE_BASE_URL,
  }
);

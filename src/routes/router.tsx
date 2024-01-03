import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Home } from "../pages/home.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { Entry } from "../pages/entry.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { Match } from "../pages/match.tsx";
import { Layout } from "./layout.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/entrylist" element={<EntryList />} />
      <Route path="/entry" element={<Entry />} />
      <Route path="/matchlist" element={<MatchList />} />
      <Route path="/match" element={<Match />} />
    </Route>
  ),
  {
    basename: import.meta.env.BASE_URL,
  }
);

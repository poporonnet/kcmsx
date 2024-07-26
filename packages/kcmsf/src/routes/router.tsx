import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { BulkEntry } from "../pages/bulkEntry.tsx";
import { Entry } from "../pages/entry.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { Home } from "../pages/home.tsx";
import { Match } from "../pages/match.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { Ranking } from "../pages/ranking.tsx";
import { Result } from "../pages/result.tsx";
import { Layout } from "./layout.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/entrylist" element={<EntryList />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/entry" element={<Entry />} />
      <Route path="/entry/bulk" element={<BulkEntry />} />
      <Route path="/matchlist" element={<MatchList />} />
      <Route path="/match" element={<Match />} />
      <Route path="/result" element={<Result />} />
    </Route>
  ),
  {
    basename: import.meta.env.BASE_URL,
  }
);

import { createBrowserRouter } from "react-router-dom";
import { Entry } from "../pages/entry.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { Home } from "../pages/home.tsx";
import { Match } from "../pages/match.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { Ranking } from "../pages/ranking.tsx";
import { Result } from "../pages/result.tsx";
import { Layout } from "./layout.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/entrylist",
    element: <EntryList />,
  },
  {
    path: "/entry",
    element: <Entry />,
  },
  {
    path: "/match",
    element: <Match />,
  },
  {
    path: "/matchlist",
    element: <MatchList />,
  },
  {
    path: "/ranking",
    element: <Ranking />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "/layout",
    element: <Layout />,
  },
]);


import { createBrowserRouter } from "react-router-dom";
import { EntryList } from "../pages/entryList.tsx";
import { Home } from "../pages/home.tsx";
import { Match } from "../pages/match.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { Team } from "../pages/team.tsx";
import { TeamBulk } from "../pages/teamBulk.tsx";
import { Layout } from "./layout.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "entrylist",
          element: <EntryList />,
        },
        {
          path: "entry",
          children: [
            {
              index: true,
              element: <Team />,
            },
            {
              path: "bulk",
              element: <TeamBulk />,
            },
          ],
        },
        {
          path: "match",
          element: <Match />,
        },
        {
          path: "match/:matchType/:id",
          element: <Match />,
        },
        {
          path: "matchlist",
          element: <MatchList />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

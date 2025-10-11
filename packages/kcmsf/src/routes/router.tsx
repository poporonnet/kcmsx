import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home.tsx";
import { Match } from "../pages/match.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { MatchView } from "../pages/matchView.tsx";
import { PublicMatchList } from "../pages/publicMatchList.tsx";
import { Ranking } from "../pages/ranking.tsx";
import { Register } from "../pages/register.tsx";
import { RegisterBulk } from "../pages/registerBulk.tsx";
import { Result } from "../pages/result.tsx";
import { Teams } from "../pages/teams.tsx";
import { Tournament } from "../pages/tournament.tsx";
import { PrivateLayout } from "./PrivateLayout.tsx";
import { PublicLayout } from "./PublicLayout.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/public",
      element: <PublicLayout />,
      children: [
        {
          path: "matchlist",
          element: <PublicMatchList />,
        },
      ],
    },
    {
      path: "/",
      element: <PrivateLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "team",
          element: <Teams />,
        },
        {
          path: "register",
          children: [
            {
              index: true,
              element: <Register />,
            },
            {
              path: "bulk",
              element: <RegisterBulk />,
            },
          ],
        },
        {
          path: "match",
          element: <Match />,
        },
        {
          path: "match/:matchType/:id",
          children: [
            {
              index: true,
              element: <Match />,
            },
            {
              path: "view",
              element: <MatchView />,
            },
          ],
        },
        {
          path: "matchlist",
          element: <MatchList />,
        },
        {
          path: "result",
          element: <Result />,
        },
        {
          path: "ranking",
          element: <Ranking />,
        },
        {
          path: "tournament",
          element: <Tournament />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

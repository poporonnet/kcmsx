import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home.tsx";
import { Match } from "../pages/match.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { Teams } from "../pages/teams.tsx";
import { Register } from "../pages/register.tsx";
import { RegisterBulk } from "../pages/registerBulk.tsx";
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
          path: "team",
          element: <Teams />,
        },
        {
          path: "entry",
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

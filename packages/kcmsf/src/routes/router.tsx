import { createBrowserRouter } from "react-router-dom";
import { Entry } from "../pages/entry.tsx";
import { EntryBulk } from "../pages/entryBulk.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { Home } from "../pages/home.tsx";
import { Match } from "../pages/match.tsx";
import { MatchList } from "../pages/matchList.tsx";
import { Result } from "../pages/result.tsx";
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
              element: <Entry />,
            },
            {
              path: "bulk",
              element: <EntryBulk />,
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
        // { 救えなかった...すまない...
        //   path: "ranking",
        //   element: <Ranking />,
        // },
        {
          path: "result",
          element: <Result />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

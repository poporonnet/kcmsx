import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Layout } from "./layout.tsx";
import { Home } from "../pages/home.tsx";
import { EntryList } from "../pages/entryList.tsx";
import { Entry } from "../pages/entry.tsx";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/entrylist" element={<EntryList />} />
      <Route path="/entry" element={<Entry />} />
    </Route>
  ),
  {
    basename: import.meta.env.VITE_BASE_URL,
  }
);

import { RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./App.css";
import { router } from "./routes/router.tsx";

const App = () => {
  return (
    <MantineProvider>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;

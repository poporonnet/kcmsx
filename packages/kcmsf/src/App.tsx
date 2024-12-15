import { RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./App.css";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { router } from "./routes/router.tsx";

const App = () => {
  return (
    <MantineProvider>
      <AuthProvider>
        <Notifications />
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  );
};

export default App;

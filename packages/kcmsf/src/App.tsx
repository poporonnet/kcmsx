import { RouterProvider } from "react-router-dom";

import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./App.css";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { router } from "./routes/router.tsx";

const theme = createTheme({
  fontFamily:
    "Segoe UI, Inter, Avenir, Helvetica, Arial, Noto Sans JP, sans-serif",
});

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <Notifications />
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  );
};

export default App;

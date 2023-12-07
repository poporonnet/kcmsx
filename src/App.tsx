import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router.tsx";
import "./App.css";
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core";

const App = () => {
  return(
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;

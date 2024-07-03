import { MantineProvider } from "@mantine/core";
import { render as testingLibraryRender } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </MantineProvider>
    ),
  });
}

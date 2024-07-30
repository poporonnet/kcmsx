import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        "src/config.ts",
        "index.ts",
      ],
      all: true,
    },
  },
});

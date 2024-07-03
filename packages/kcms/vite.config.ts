import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    vitest: undefined,
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      all: true,
      reporter: ['html', 'clover', 'text'],
    },
  },
});

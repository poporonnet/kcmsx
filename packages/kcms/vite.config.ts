import { defineConfig } from 'vite';

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

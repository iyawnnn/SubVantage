import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // 👇 ADD THIS SECTION
    exclude: [
      '**/node_modules/**', 
      '**/dist/**', 
      '**/tests/e2e/**' // 👈 This tells Vitest: "Don't touch the Playwright tests!"
    ],
  },
});
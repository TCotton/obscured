import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      instances: [
        { browser: 'chromium' }
      ],
      provider: playwright(),
      headless: true,
    },
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});

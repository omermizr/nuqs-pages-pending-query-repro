import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3027' },
  webServer: {
    command: process.env.REPRO_PRODUCTION ? 'npm run start' : 'npm run dev',
    url: 'http://127.0.0.1:3027/widgets/red?count=1',
    timeout: 120000
  }
})

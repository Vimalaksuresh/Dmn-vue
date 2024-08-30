// playwright.config.js
module.exports = {
    use: {
      headless: true,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    },
    webServer: {
      command: 'npm run dev',
      port: 3000,
      timeout: 120 * 1000,
    },
  };
  
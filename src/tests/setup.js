// tests/setup.js
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { chromium } from 'playwright';

let browser;
let context;
let page;

beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});

beforeEach(async () => {
    page = await context.newPage();
  });

afterAll(async () => {
  await browser.close();
});

global.browser = browser;
global.context = context;
global.page = page;

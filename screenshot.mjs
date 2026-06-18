import puppeteer from 'puppeteer';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const SHOTS_DIR = join(ROOT, 'temporary screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

// Auto-increment filename
const files = await readdir(SHOTS_DIR).catch(() => []);
const nums = files
  .map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1]))
  .filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${next}${label}.png`;
const outPath = join(SHOTS_DIR, filename);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: temporary screenshots/${filename}`);

import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const meta = JSON.parse(readFileSync(new URL('../build/meta.json', import.meta.url), 'utf8')) as { stories: Record<string, unknown> };
const STORIES = Object.keys(meta.stories);
const WIDTHS = [390, 768, 1024, 1440];

async function open(page: Page, id: string, width: number, theme: 'light' | 'dark') {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`/?story=${id}&mode=preview&theme=${theme}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}

async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
}

test('Ladle build lists stories', () => {
  expect(STORIES.length).toBeGreaterThanOrEqual(15);
});

for (const id of STORIES) {
  for (const width of WIDTHS) {
    test(`${id} @${width}px light`, async ({ page }, info) => {
      await open(page, id, width, 'light');
      await page.screenshot({ path: info.outputPath(`${id}-${width}-light.png`), fullPage: true });
      await expectNoOverflow(page);
      if (width === 1024) await expectAccessible(page);
    });
  }
  test(`${id} @1024px dark`, async ({ page }, info) => {
    await open(page, id, 1024, 'dark');
    await page.screenshot({ path: info.outputPath(`${id}-1024-dark.png`), fullPage: true });
    await expectNoOverflow(page);
    await expectAccessible(page);
  });
}

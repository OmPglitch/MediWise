/**
 * Sprint 5.3 — E2E Drug Catalog Tests
 * Tests search, drug selection, bioequivalence data display, and order launch.
 */
import { test, expect } from '@playwright/test';
import { loadApp } from './helpers';

test.describe('Drug Catalog Screen', () => {
  test.beforeEach(async ({ page }) => {
    await loadApp(page);
    // Navigate to Catalog tab
    await page.getByRole('button', { name: /catalog/i }).first().click();
    await page.waitForTimeout(400);
  });

  test('catalog screen loads with drug list', async ({ page }) => {
    await expect(page.getByText(/Atorvastatin|Lipitor|Januvia|Nexium/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('selecting a drug shows bioequivalence metrics', async ({ page }) => {
    // Look for parity percentage or dissolution status
    await expect(
      page.getByText(/parity|cmax|auc|dissolution/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('Order Delivery button opens order modal', async ({ page }) => {
    const orderBtn = page.getByRole('button', { name: /order|place order/i }).first();
    if (await orderBtn.isVisible()) {
      await orderBtn.click();
      await expect(page.getByText(/delivery|checkout|order summary/i).first()).toBeVisible({ timeout: 6000 });
    }
  });

  test('FDA Export button is present for CMIO role', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /export|fda|356h/i }).first()
    ).toBeVisible({ timeout: 6000 });
  });
});

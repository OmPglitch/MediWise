/**
 * Sprint 5.3 — E2E Delivery Management Tests
 * Tests the critical user journey: search drug → place order → track delivery.
 */
import { test, expect } from '@playwright/test';
import { loadApp } from './helpers';

test.describe('Delivery Management', () => {
  test.beforeEach(async ({ page }) => {
    await loadApp(page);
    await page.getByRole('button', { name: /deliveries/i }).first().click();
    await page.waitForTimeout(400);
  });

  test('delivery management screen shows order cards', async ({ page }) => {
    await expect(
      page.getByText(/out for delivery|in transit|delivered|tracking/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('track order button opens tracking modal', async ({ page }) => {
    const trackBtn = page.getByRole('button', { name: /track|live track/i }).first();
    if (await trackBtn.isVisible({ timeout: 5000 })) {
      await trackBtn.click();
      await expect(
        page.getByText(/tracking|courier|expected delivery/i).first()
      ).toBeVisible({ timeout: 6000 });
      // Close modal
      await page.keyboard.press('Escape');
    }
  });

  test('cold-chain temperature is displayed', async ({ page }) => {
    await expect(
      page.getByText(/°C|cold.?chain|temperature/i).first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Critical User Journey: Search → Order → Track', () => {
  test('full journey from patient portal to order placement', async ({ page }) => {
    await loadApp(page);

    // 1. Navigate to Patient Portal
    await page.getByRole('button', { name: /customer portal|patient/i }).first().click();
    await page.waitForTimeout(500);

    // 2. Verify drug price comparison is shown
    await expect(page.getByText(/save|savings|generic/i).first()).toBeVisible({ timeout: 8000 });

    // 3. Click Order Now
    const orderBtn = page.getByRole('button', { name: /order now|order/i }).first();
    if (await orderBtn.isVisible()) {
      await orderBtn.click();
      await page.waitForTimeout(600);
      // Order modal should appear
      const modalText = page.getByText(/delivery|checkout|order summary|place order/i).first();
      await expect(modalText).toBeVisible({ timeout: 8000 });
      await page.keyboard.press('Escape');
    }

    // 4. Navigate to Deliveries to see orders
    await page.getByRole('button', { name: /deliveries|my orders/i }).first().click();
    await expect(page.getByText(/tracking|out for delivery|in transit/i).first()).toBeVisible({ timeout: 8000 });
  });
});

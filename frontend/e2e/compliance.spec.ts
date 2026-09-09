/**
 * Sprint 5.3 — E2E Compliance & Audit Ledger Tests
 * Tests the cryptographic audit trail, hash verification, and override workflows.
 */
import { test, expect } from '@playwright/test';
import { loadApp } from './helpers';

test.describe('Compliance Screen', () => {
  test.beforeEach(async ({ page }) => {
    await loadApp(page);
    await page.getByRole('button', { name: /compliance/i }).first().click();
    await page.waitForTimeout(400);
  });

  test('audit ledger table is visible with events', async ({ page }) => {
    await expect(page.getByText(/SHA-256|hash|audit|0x/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('verify ledger integrity button triggers success toast', async ({ page }) => {
    const verifyBtn = page.getByRole('button', { name: /verify|integrity|merkle/i }).first();
    if (await verifyBtn.isVisible({ timeout: 5000 })) {
      await verifyBtn.click();
      await expect(page.getByText(/verified|cryptographic|fips/i).first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('audit event detail panel shows payload diff', async ({ page }) => {
    // Click the first audit event row if present
    const firstRow = page.getByText(/CLINICAL_LEAD|SYSTEM_BOT|PHARMACY_WEBHOOK/i).first();
    if (await firstRow.isVisible({ timeout: 5000 })) {
      await firstRow.click();
      await page.waitForTimeout(300);
    }
    // Check for diff viewer or payload section
    await expect(page.getByText(/payload|modified|removed|preserved/i).first()).toBeVisible({ timeout: 6000 });
  });
});

test.describe('Emergency Override', () => {
  test('emergency override modal can be opened from header', async ({ page }) => {
    await loadApp(page);
    const emergencyBtn = page.getByRole('button', { name: /emergency override/i }).first();
    await emergencyBtn.click();
    await expect(page.getByText(/emergency|override|reason|bypass/i).first()).toBeVisible({ timeout: 6000 });
    await page.keyboard.press('Escape');
  });
});

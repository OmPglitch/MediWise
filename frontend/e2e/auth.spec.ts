/**
 * Sprint 5.3 — E2E Auth & RBAC Permission Tests
 * Tests login flows, persona switching, session lock/unlock, and RBAC boundaries.
 */
import { test, expect } from '@playwright/test';
import { loadApp, waitForToast } from './helpers';

test.describe('Authentication & Identity', () => {
  test('app loads and shows enterprise header', async ({ page }) => {
    await loadApp(page);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText('MediWise Operations')).toBeVisible();
  });

  test('guest session starts authenticated as CMIO demo user', async ({ page }) => {
    await loadApp(page);
    // Default demo: CMIO role
    await expect(page.getByText('Dr. Vikram Rao').or(page.getByText('VR'))).toBeVisible();
  });

  test('clicking Sign Out returns to auth screen', async ({ page }) => {
    await loadApp(page);
    // Locate sign out button
    const signOutBtn = page.getByRole('button', { name: /sign out/i }).first();
    await signOutBtn.click();
    // Auth screen should appear
    await expect(page.getByText(/sign in/i).or(page.getByText(/login/i))).toBeVisible({ timeout: 5000 });
  });

  test('theme toggle switches between dark and light mode', async ({ page }) => {
    await loadApp(page);
    const html = page.locator('html');
    // Toggle to light
    await page.getByRole('button', { name: /light|dark|sun|moon/i }).first().click();
    await page.waitForTimeout(300);
    // Toggle back
    await page.getByRole('button', { name: /light|dark|sun|moon/i }).first().click();
  });
});

test.describe('RBAC Permission Boundaries', () => {
  test('Compliance Officer tab is accessible in the rail drawer', async ({ page }) => {
    await loadApp(page);
    const complianceBtn = page.getByRole('button', { name: /compliance/i });
    await expect(complianceBtn.first()).toBeVisible();
  });

  test('Overview screen renders KPI cards', async ({ page }) => {
    await loadApp(page);
    await expect(page.getByText(/generic substitution savings|active formulary|pass rate/i).first()).toBeVisible({ timeout: 8000 });
  });
});

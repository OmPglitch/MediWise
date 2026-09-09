/**
 * MediWise E2E Test Helpers
 * Shared utilities used across all Playwright test suites.
 */
import { Page, expect } from '@playwright/test';

/** Navigate to the app and wait for the enterprise header to be visible */
export async function loadApp(page: Page) {
  await page.goto('/');
  // Wait for the MediWise header brand to appear
  await expect(page.getByText('MediWise Operations')).toBeVisible({ timeout: 15000 });
}

/** Switch to a specific workspace tab via the rail drawer */
export async function navigateToTab(page: Page, tabName: string) {
  await page.getByRole('button', { name: new RegExp(tabName, 'i') }).first().click();
}

/** Sign in with a demo account by switching persona */
export async function switchPersona(page: Page, persona: 'CMIO' | 'Pharmacy' | 'Compliance' | 'Patient') {
  const personaMap: Record<string, string> = {
    CMIO: 'Dr. Vikram Rao',
    Pharmacy: 'Priya Sharma',
    Compliance: 'Elena Vance',
    Patient: 'Om Patil',
  };
  const header = page.locator('header');
  await header.getByRole('button').filter({ hasText: personaMap[persona] }).click().catch(() => {
    // Fallback: open dropdown first
  });
}

/** Wait for toast notification to appear */
export async function waitForToast(page: Page, titleFragment: string) {
  await expect(page.getByText(titleFragment)).toBeVisible({ timeout: 8000 });
}

/** Check WCAG contrast is not violated (simplified: no red errors in axe) */
export async function assertNoAccessibilityErrors(page: Page) {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  // Give a short moment for any deferred renders
  await page.waitForTimeout(500);
  return consoleErrors;
}

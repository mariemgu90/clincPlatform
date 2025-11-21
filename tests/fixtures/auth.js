import { test as base } from '@playwright/test';

/**
 * Custom test fixture with admin authentication
 * Handles login and setup for admin tests
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill in login credentials (use test admin user)
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');

    // Click login button
    await page.click('button:has-text("Login")');

    // Wait for navigation to dashboard or authenticated page
    await page.waitForURL('/admin/dashboard', { timeout: 10000 });

    // Use the authenticated page
    await use(page);
  },
});

export { expect } from '@playwright/test';

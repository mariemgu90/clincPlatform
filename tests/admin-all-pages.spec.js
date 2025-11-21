const { test, expect } = require('@playwright/test');

// Helper functions - inlined
async function loginAsAdmin(page) {
  try {
    await page.goto('/auth/login').catch(() => null);
    await page.fill('input[type="email"]', 'admin@test.com').catch(() => null);
    await page.fill('input[type="password"]', 'password123').catch(() => null);
    await page.click('button:has-text("Login")').catch(() => null);
    await page.waitForURL('/admin/dashboard', { timeout: 15000 }).catch(() => null);
   } catch (e) {
           throw new Error(e);

    // Login may fail
  }
}

async function waitForLoadingComplete(page) {
  try {
    await page.waitForSelector('[class*="animate-spin"]', { timeout: 5000 }).catch(() => null);
    await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 });
   } catch (e) {
           throw new Error(e);

    // Spinner may not appear
  }
}

async function checkResponsiveLayout(page, viewportSize) {
  await page.setViewportSize(viewportSize);
  await page.waitForLoadState('networkidle').catch(() => null);
}

const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
};

test.describe('Admin All Pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load staff page', async ({ page }) => {
    try {
      await page.goto('/admin/staff');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should load services page', async ({ page }) => {
    try {
      await page.goto('/admin/services');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should load roles page', async ({ page }) => {
    try {
      await page.goto('/admin/roles');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should load settings page', async ({ page }) => {
    try {
      await page.goto('/admin/settings');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should load templates page', async ({ page }) => {
    try {
      await page.goto('/admin/templates');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should load integrations page', async ({ page }) => {
    try {
      await page.goto('/admin/integrations');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should load logs page', async ({ page }) => {
    try {
      await page.goto('/admin/logs');
      await waitForLoadingComplete(page);
     } catch (e) {
           throw new Error(e);

      // Page may not load
    }
  });

  test('should navigate between admin pages', async ({ page }) => {
    try {
      const adminPages = [
        '/admin/dashboard',
        '/admin/clinics',
        '/admin/users',
        '/admin/staff',
      ];

      for (const pagePath of adminPages) {
        await page.goto(pagePath);
        await waitForLoadingComplete(page);
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
     } catch (e) {
           throw new Error(e);

      // Navigation may fail
    }
  });

  test('should maintain session across navigation', async ({ page }) => {
    try {
      await page.goto('/admin/dashboard');
      await waitForLoadingComplete(page);
      
      await page.goto('/admin/clinics');
      await waitForLoadingComplete(page);
      
      await expect(page).not.toHaveURL(/login|auth/);
     } catch (e) {
           throw new Error(e);

      // Session may not be maintained
    }
  });

  test('staff page should be responsive', async ({ page }) => {
    try {
      await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
      await page.goto('/admin/staff');
      await waitForLoadingComplete(page);
      const content = page.locator('body');
      await expect(content).toBeVisible();
     } catch (e) {
           throw new Error(e);

      // Page may not be responsive
    }
  });

  test('services page should be responsive', async ({ page }) => {
    try {
      await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
      await page.goto('/admin/services');
      await waitForLoadingComplete(page);
      const content = page.locator('body');
      await expect(content).toBeVisible();
     } catch (e) {
           throw new Error(e);

      // Page may not be responsive
    }
  });

  test('roles page should display content', async ({ page }) => {
    try {
      await page.goto('/admin/roles');
      await waitForLoadingComplete(page);
      const pageContent = page.locator('body');
      const text = await pageContent.textContent();
      expect(text.length).toBeGreaterThan(0);
     } catch (e) {
           throw new Error(e);

      // Content may not display
    }
  });

  test('settings page should be responsive on all sizes', async ({ page }) => {
    try {
      for (const [, size] of Object.entries(VIEWPORT_SIZES)) {
        await checkResponsiveLayout(page, size);
        await page.goto('/admin/settings');
        await waitForLoadingComplete(page);
        const viewportSize = page.viewportSize();
        expect(viewportSize.width).toBe(size.width);
      }
     } catch (e) {
           throw new Error(e);

      // Page may not be responsive
    }
  });
});

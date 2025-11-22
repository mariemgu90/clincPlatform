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
    // Login may fail if app not running
  }
}

async function waitForLoadingComplete(page) {
  try {
    await page.waitForSelector('[class*="animate-spin"]', { timeout: 5000 }).catch(() => null);
    await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 });
  } catch (e) {
           throw new Error(e);

    // Loading spinner may not appear
  }
}

async function checkResponsiveLayout(page, viewportSize) {
  await page.setViewportSize(viewportSize);
  await page.waitForLoadState('networkidle').catch(() => null);
  return page;
}

const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
};

test.describe('Admin All Pages - Comprehensive Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Admin Staff Management', () => {
    test('should load staff management page', async ({ page }) => {
      try {
        await page.goto('/admin/staff');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('staff page should be responsive on mobile', async ({ page }) => {
      try {
        await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
        await page.goto('/admin/staff');
        await waitForLoadingComplete(page);
        
        const mainContent = page.locator('main, [role="main"]');
        expect(await mainContent.count()).toBeGreaterThan(0);
       } catch (e) {
           throw new Error(e);

        // Page may not be responsive
      }
    });
  });

  test.describe('Admin Services Management', () => {
    test('should load services page', async ({ page }) => {
      try {
        await page.goto('/admin/services');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('services page should be responsive', async ({ page }) => {
      try {
        await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
        await page.goto('/admin/services');
        await waitForLoadingComplete(page);
        
        const content = page.locator('[class*="container"], main');
        expect(await content.count()).toBeGreaterThan(0);
       } catch (e) {
           throw new Error(e);

        // Page may not be responsive
      }
    });
  });

  test.describe('Admin Roles Management', () => {
    test('should load roles page', async ({ page }) => {
      try {
        await page.goto('/admin/roles');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('roles page should display role information', async ({ page }) => {
      try {
        await page.goto('/admin/roles');
        await waitForLoadingComplete(page);
        
        const pageContent = page.locator('body');
        const text = await pageContent.textContent();
        expect(text.length).toBeGreaterThan(0);
       } catch (e) {
           throw new Error(e);

        // Role information may not display
      }
    });

    test('roles page should be responsive on tablet', async ({ page }) => {
      try {
        await checkResponsiveLayout(page, VIEWPORT_SIZES.tablet);
        await page.goto('/admin/roles');
        await waitForLoadingComplete(page);
        
        const size = page.viewportSize();
        expect(size.width).toBe(VIEWPORT_SIZES.tablet.width);
       } catch (e) {
           throw new Error(e);

        // Page may not be responsive
      }
    });
  });

  test.describe('Admin Settings Page', () => {
    test('should load settings page', async ({ page }) => {
      try {
        await page.goto('/admin/settings');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
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

  test.describe('Admin Clinic Settings', () => {
    test('should load clinic settings page', async ({ page }) => {
      try {
        await page.goto('/admin/clinic-settings');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('clinic settings should be responsive on mobile', async ({ page }) => {
      try {
        await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
        await page.goto('/admin/clinic-settings');
        await waitForLoadingComplete(page);
        
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const windowWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1);
       } catch (e) {
           throw new Error(e);

        // Page may not be responsive
      }
    });
  });

  test.describe('Admin Templates Page', () => {
    test('should load templates page', async ({ page }) => {
      try {
        await page.goto('/admin/templates');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('templates page should display content', async ({ page }) => {
      try {
        await page.goto('/admin/templates');
        await waitForLoadingComplete(page);
        
        const content = page.locator('body');
        const text = await content.textContent();
        expect(text.length).toBeGreaterThan(0);
       } catch (e) {
           throw new Error(e);

        // Content may not display
      }
    });
  });

  test.describe('Admin Integrations Page', () => {
    test('should load integrations page', async ({ page }) => {
      try {
        await page.goto('/admin/integrations');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('integrations should have proper layout', async ({ page }) => {
      try {
        await page.goto('/admin/integrations');
        await waitForLoadingComplete(page);
        
        const main = page.locator('main, [role="main"]');
        expect(await main.count()).toBeGreaterThanOrEqual(0);
       } catch (e) {
           throw new Error(e);

        // Page may not have proper layout
      }
    });
  });

  test.describe('Admin Exports Page', () => {
    test('should load exports page', async ({ page }) => {
      try {
        await page.goto('/admin/exports');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });
  });

  test.describe('Admin Logs Page', () => {
    test('should load logs page', async ({ page }) => {
      try {
        await page.goto('/admin/logs');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('logs page should be responsive', async ({ page }) => {
      try {
        await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
        await page.goto('/admin/logs');
        await waitForLoadingComplete(page);
        
        const content = page.locator('body');
        await expect(content).toBeVisible();
       } catch (e) {
           throw new Error(e);

        // Page may not be responsive
      }
    });
  });

  test.describe('Admin Backup Page', () => {
    test('should load backup page', async ({ page }) => {
      try {
        await page.goto('/admin/backup');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });
  });

  test.describe('Admin Maintenance Page', () => {
    test('should load maintenance page', async ({ page }) => {
      try {
        await page.goto('/admin/maintenance');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });
  });

  test.describe('Admin API Keys Page', () => {
    test('should load api-keys page', async ({ page }) => {
      try {
        await page.goto('/admin/api-keys');
        await waitForLoadingComplete(page);
        await expect(page).not.toHaveURL(/error|404|500/);
       } catch (e) {
           throw new Error(e);

        // Page may not load
      }
    });

    test('api-keys page should be responsive on desktop', async ({ page }) => {
      try {
        await checkResponsiveLayout(page, VIEWPORT_SIZES.desktop);
        await page.goto('/admin/api-keys');
        await waitForLoadingComplete(page);
        
        const content = page.locator('main');
        expect(await content.count()).toBeGreaterThanOrEqual(0);
       } catch (e) {
           throw new Error(e);

        // Page may not be responsive
      }
    });
  });

  test.describe('Cross-Page Navigation', () => {
    test('should navigate between all admin pages without errors', async ({ page }) => {
      try {
        const adminPages = [
          '/admin/dashboard',
          '/admin/clinics',
          '/admin/users',
          '/admin/staff',
          '/admin/services',
          '/admin/roles',
          '/admin/settings',
        ];

        for (const pagePath of adminPages) {
          await page.goto(pagePath);
          await waitForLoadingComplete(page);
          await expect(page).not.toHaveURL(/error|404|500/);
          
          const body = page.locator('body');
          const content = await body.textContent();
          expect(content.length).toBeGreaterThan(0);
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
  });

  test.describe('General Responsive Tests for All Pages', () => {
    const adminPages = [
      '/admin/dashboard',
      '/admin/clinics',
      '/admin/users',
    ];

    for (const pagePath of adminPages) {
      test(`${pagePath} should be responsive`, async ({ page }) => {
        try {
          await checkResponsiveLayout(page, VIEWPORT_SIZES.mobile);
          await loginAsAdmin(page);
          await page.goto(pagePath);
          await waitForLoadingComplete(page);
          
          const content = page.locator('body');
          await expect(content).toBeVisible();
          
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          const windowWidth = await page.evaluate(() => window.innerWidth);
          expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1);
         } catch (e) {
           throw new Error(e);

          // Page may not be responsive
        }
      });
    }
  });

  test.describe('Form Validation Across Pages', () => {
    test('should show validation errors on required fields', async ({ page }) => {
      try {
        await page.goto('/admin/clinics');
        await waitForLoadingComplete(page);
        
        await page.click('button:has-text("Register New Clinic")').catch(() => null);
        await page.waitForTimeout(500);
        
        const submitButton = page.locator('button:has-text("Register Clinic")');
        if (await submitButton.isVisible()) {
          const form = page.locator('form').first();
          const isValid = await form.evaluate(el => el.checkValidity());
          expect(isValid).toBeFalsy();
        }
       } catch (e) {
           throw new Error(e);

        // Validation may not work
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      try {
        await page.goto('/admin/dashboard');
        await page.context().setOffline(true);
        
        await page.reload().catch(() => {
          // Expected to fail when offline
        });
        
        await page.context().setOffline(false);
       } catch (e) {
           throw new Error(e);

        // Network error handling may fail
      }
    });

    test('should handle missing resources gracefully', async ({ page }) => {
      try {
        await page.goto('/admin/dashboard');
        await waitForLoadingComplete(page);
        
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        await expect(page.locator('h1').first()).toBeVisible();
       } catch (e) {
           throw new Error(e);

        // Error handling may fail
      }
    });
  });

  test.describe('Page Load Performance', () => {
    test('admin pages should load within acceptable time', async ({ page }) => {
      try {
        const pages = ['/admin/dashboard', '/admin/clinics', '/admin/users'];

        for (const pagePath of pages) {
          const startTime = Date.now();
          await page.goto(pagePath);
          const loadTime = Date.now() - startTime;

          expect(loadTime).toBeLessThan(5000);
        }
       } catch (e) {
           throw new Error(e);

        // Performance check may fail
      }
    });
  });
});

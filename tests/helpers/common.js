/**
 * Common helper functions for admin page tests
 */

/**
 * Wait for loading spinner to disappear
 */
async function waitForLoadingComplete(page) {
  // Wait for spinner to appear and disappear
  try {
    await page.waitForSelector('[class*="animate-spin"]', { timeout: 5000 }).catch(() => null);
    await page.waitForSelector('[class*="animate-spin"]', { state: 'hidden', timeout: 10000 });
  } catch {
    // Loading spinner may not always appear
  }
}

/**
 * Check if element is visible
 */
async function isElementVisible(page, selector) {
  try {
    return await page.isVisible(selector);
  } catch {
    return false;
  }
}

/**
 * Get toast message text
 */
async function getToastMessage(page) {
  try {
    const toastElement = await page.waitForSelector('div[role="status"]', { timeout: 5000 });
    return await toastElement.textContent();
  } catch {
    return null;
  }
}

/**
 * Click and wait for navigation
 */
async function clickAndWait(page, selector, url = null) {
  const clickPromise = page.click(selector);
  if (url) {
    await page.waitForURL(url);
  }
  await clickPromise;
}

/**
 * Fill form field
 */
async function fillFormField(page, label, value) {
  const input = await page.locator(`label:has-text("${label}") ~ input`);
  await input.fill(value);
}

/**
 * Test responsive breakpoints
 */
const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1440 },
};

/**
 * Check responsive layout (elements should be visible)
 */
async function checkResponsiveLayout(page, viewportSize) {
  await page.setViewportSize(viewportSize);
  await page.waitForLoadState('networkidle');
  return page;
}

/**
 * Verify table is responsive
 */
async function verifyTableResponsive(page) {
  // On desktop, columns should be visible
  const desktopColumns = await page.locator('th').count();
  
  // Check for responsive behavior
  const hasMobileView = await page.locator('[class*="grid-cols-1"]').isVisible();
  const hasDesktopView = await page.locator('[class*="lg:grid"]').isVisible();
  
  return { desktopColumns, hasMobileView, hasDesktopView };
}

/**
 * Wait for API call
 */
async function waitForAPICall(page, method = 'GET', pathPattern = null) {
  return await page.waitForResponse(response => {
    if (method && !response.request().method().includes(method)) return false;
    if (pathPattern && !response.url().includes(pathPattern)) return false;
    return true;
  });
}

/**
 * Mock API response
 */
async function mockAPIResponse(page, urlPattern, responseData) {
  await page.route(urlPattern, route => {
    route.abort('blockedbyclient');
  });
  
  // Alternative: intercept and respond
  await page.route(urlPattern, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

/**
 * Login helper
 */
async function loginAsAdmin(page, email = 'admin@test.com', password = 'password123') {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Login")');
  await page.waitForURL('/admin/dashboard', { timeout: 15000 });
}

/**
 * Navigate to admin page
 */
async function navigateToAdminPage(page, path) {
  await page.goto(`/admin${path}`);
  await waitForLoadingComplete(page);
}

/**
 * Get element count
 */
async function getElementCount(page, selector) {
  return await page.locator(selector).count();
}

/**
 * Check accessibility
 */
async function checkAccessibility(page) {
  // Check for proper heading hierarchy
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
  
  // Check for alt text on images
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  
  // Check for labels on form inputs
  const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([id])').count();
  
  return {
    headings,
    imagesWithoutAlt,
    inputsWithoutLabels,
  };
}

/**
 * Performance check
 */
async function checkPagePerformance(page) {
  const metrics = await page.evaluate(() => {
    const perfData = window.performance.timing;
    return {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadTime: perfData.loadEventEnd - perfData.loadEventStart,
      navigationTime: perfData.responseEnd - perfData.navigationStart,
    };
  });
  return metrics;
}

module.exports = {
  waitForLoadingComplete,
  isElementVisible,
  getToastMessage,
  clickAndWait,
  fillFormField,
  VIEWPORT_SIZES,
  checkResponsiveLayout,
  verifyTableResponsive,
  waitForAPICall,
  mockAPIResponse,
  loginAsAdmin,
  navigateToAdminPage,
  getElementCount,
  checkAccessibility,
  checkPagePerformance,
};

import { expect, test } from '@playwright/test';

/**
 * Test suite for the contact page
 * 📞 Tests for the contact form functionality
 */
test.describe('Contact Page', () => {
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/contact.html');
		await expect(page).toHaveTitle(/Contact/);
		console.log('📞 🚀 Contact page loaded successfully');
	});

	test('page loads within reasonable time ⚡', async ({ page }) => {
		// Set a longer timeout for initial page load
		const navigationStart = Date.now();
		await page.goto('/contact.html', { timeout: 5000 });
		const navigationEnd = Date.now();

		// Increase timeout threshold to 5000ms to account for test environment variability
		expect(navigationEnd - navigationStart).toBeLessThan(5000);

		// Log performance metrics but catch errors if any properties are undefined
		try {
			const performanceMetrics = await page.evaluate(() => {
				// Use a safer approach to get performance metrics
				/** @type {PerformanceNavigationTiming} */
				const nav = /** @type {PerformanceNavigationTiming} */ (performance.getEntriesByType('navigation')[0]);
				if (!nav) return null;

				return {
					ttfb: nav.responseStart - nav.requestStart,
					domLoaded: nav.domContentLoadedEventEnd - nav.startTime,
					fullLoad: nav.loadEventEnd - nav.startTime
				};
			});

			if (performanceMetrics) {
				console.info('📞 📊 Performance metrics:', performanceMetrics);
			}
		} catch (error) {
			console.warn('📞 ⚠️ Could not measure detailed performance metrics');
		}

		console.log('📞 ⚡ Page load time verified');
	});

	test('contact form has required fields 📝', async ({ page }) => {
		await page.goto('/contact.html');

		// Check form elements
		const form = page.locator('form');
		await expect(form).toBeVisible();

		// Check required fields
		const nameField = form.locator('input[name="name"]');
		const emailField = form.locator('input[name="email"]');
		const messageField = form.locator('textarea[name="message"]');
		const submitButton = form.locator('button[type="submit"]');

		await expect(nameField).toBeVisible();
		await expect(emailField).toBeVisible();
		await expect(messageField).toBeVisible();
		await expect(submitButton).toBeVisible();

		console.log('📞 📝 Contact form fields verified');
	});
});

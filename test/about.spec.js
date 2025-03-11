import { expect, test } from '@playwright/test';

/**
 * Test suite for the about page
 * 📚 Tests for the about page functionality
 */
test.describe('About Page', () => {
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/about.html');
		await expect(page).toHaveTitle(/About/);
		console.log('📚 🚀 About page loaded successfully');
	});

	test('navigation works correctly 🧭', async ({ page }) => {
		// Start at the about page
		await page.goto('/about.html');

		// Get the navigation links from site-header component
		const navLinks = page.locator('site-header a');
		await expect(navLinks).toBeVisible();

		// Verify home link exists
		const homeLink = navLinks.filter({ hasText: /Home/i }).first();
		await expect(homeLink).toBeVisible();

		// Verify contact link exists
		const contactLink = navLinks.filter({ hasText: /Contact/i }).first();
		await expect(contactLink).toBeVisible();

		// Verify we're on the about page (current)
		const aboutLink = navLinks.filter({ hasText: /About/i }).first();
		await expect(aboutLink).toBeVisible();
		await expect(aboutLink).toHaveAttribute('aria-current', 'page');

		console.log('📚 🧭 Navigation structure verified');
	});

	test('about page content loads correctly 📄', async ({ page }) => {
		await page.goto('/about.html');

		// Check for main content section
		const mainContent = page.locator('main');
		await expect(mainContent).toBeVisible();

		// Check for about page specific content
		const heading = mainContent.locator('h1').first();
		await expect(heading).toBeVisible();

		// Take a screenshot for visual comparison
		await expect(page).toHaveScreenshot('about-page-baseline.png');

		console.log('📚 📄 About page content verified');
	});
});

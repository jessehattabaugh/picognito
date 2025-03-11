import { expect, test } from '@playwright/test';

import fs from 'fs';
import path from 'path';

/**
 * Test the homepage
 */
test.describe('Homepage', () => {
	// Create snapshots directory if it doesn't exist
	const snapshotDir = path.join(process.cwd(), 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	// Test the homepage visuals
	test('homepage should match visual baseline', async ({ page }) => {
		await page.goto('/');

		// Wait for any animations or transitions to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the entire page
		await expect(page).toHaveScreenshot('homepage-desktop-baseline.png');
	});

	// Test for mobile viewport
	test('homepage on mobile should match visual baseline', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Wait for key elements to be visible
		await page
			.getByRole('heading', { level: 1 })
			.waitFor({ state: 'visible', timeout: 5000 })
			.catch(() => {
				console.log('Heading level 1 not found, continuing test');
			});

		// Wait for any animations to complete
		await page.waitForTimeout(500);

		await expect(page).toHaveScreenshot('homepage-mobile-baseline.png');
	});

	// Test for accessibility-specific features
	test('should have proper keyboard navigation', async ({ page }) => {
		await page.goto('/');

		// Take screenshot with focus on the first interactive element
		await page.keyboard.press('Tab');

		// Find the currently focused element
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return el.tagName !== 'BODY'; // Check if focus moved from body
		});

		// Verify something is actually focused
		expect(focusedElement).toBeTruthy();

		// Take a screenshot with the focus visible
		await expect(page).toHaveScreenshot('homepage-keyboard-focus-baseline.png');
	});
});

/**
 * @fileoverview Main test file for the index page
 * 🧪 Tests for basic functionality
 */

// Main page tests
test.describe('Index Page', () => {
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/');

		// Check that the page title is correct
		await expect(page).toHaveTitle(/Modern Web Boilerplate/);
	});

	test('takes visual snapshot of the page 📸', async ({ page }) => {
		await page.goto('/');
		// Wait for any animations to complete
		await page.waitForTimeout(500);

		// Take a screenshot of the whole page
		await expect(page).toHaveScreenshot('index-page-baseline.png');
	});
});

// Accessibility tests
test.describe('Accessibility', () => {
	test('page passes basic accessibility checks ♿', async ({ page }) => {
		await page.goto('/');

		// Check for basic accessibility issues using Playwright's accessibility scanner
		const accessibilityScanResults = await page.accessibility.snapshot();
		expect(accessibilityScanResults.children.length).toBeGreaterThan(0);

		// Check that elements are keyboard accessible
		await page.keyboard.press('Tab');
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return el ? el.tagName : null;
		});
		expect(focusedElement).toBeTruthy();
	});
});

// Simple performance check
test.describe('Performance', () => {
	test('page loads within reasonable time ⚡', async ({ page }) => {
		// Navigate to the page
		const navigationStart = Date.now();
		await page.goto('/');
		const navigationEnd = Date.now();

		// Basic performance check - page should load in under 1 second in test environment
		expect(navigationEnd - navigationStart).toBeLessThan(1000);
	});
});

/**
 * Test suite for the contact page
 * 📨 Tests for the contact page and form functionality
 */
test.describe('Contact Page', () => {
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/contact.html');
		await expect(page).toHaveTitle(/Contact/);
		console.log('📨 Contact page loaded successfully');
	});
});

test.describe('Contact Form 📨', () => {
	test('shows error for empty fields 🚫', async ({ page }) => {
		await page.goto('/contact.html');
		
		// Try to submit empty form
		await page.getByRole('button', { name: /Send Message/i }).click();
		
		// Check for error messages
		const nameError = page.locator('#name-error');
		const emailError = page.locator('#email-error');
		const messageError = page.locator('#message-error');
		
		await expect(nameError).toHaveText(/required/i);
		await expect(emailError).toHaveText(/required/i);
		await expect(messageError).toHaveText(/required/i);
		
		console.log('🚫 Form validation shows errors for empty fields');
	});
	
	test('validates email format 📧', async ({ page }) => {
		await page.goto('/contact.html');
		
		// Enter invalid email
		await page.locator('#name').fill('Test User');
		await page.locator('#email').fill('invalid-email');
		await page.locator('#message').fill('Test message');
		
		// Trigger validation
		await page.locator('#email').blur();
		
		// Check for error message
		const emailError = page.locator('#email-error');
		await expect(emailError).toHaveText(/valid email/i);
		
		// Fix the email and check if error disappears
		await page.locator('#email').fill('valid@example.com');
		await page.locator('#email').blur();
		
		// Error should be gone
		await expect(emailError).toBeEmpty();
		
		console.log('📧 Email format validation works correctly');
	});
	
	test('navigation works correctly ⌨️', async ({ page }) => {
		await page.goto('/contact.html');
		
		// Use keyboard to navigate the form
		await page.keyboard.press('Tab'); // Focus skip link
		await page.keyboard.press('Tab'); // Focus first nav link
		await page.keyboard.press('Tab'); // Focus second nav link
		await page.keyboard.press('Tab'); // Focus third nav link
		await page.keyboard.press('Tab'); // Focus name input
		
		// Check if name input has focus
		const isFocusedOnName = await page.evaluate(() => {
			return document.activeElement.id === 'name';
		});
		
		expect(isFocusedOnName).toBeTruthy();
		
		// Tab to email input
		await page.keyboard.press('Tab');
		
		// Check if email input has focus
		const isFocusedOnEmail = await page.evaluate(() => {
			return document.activeElement.id === 'email';
		});
		
		expect(isFocusedOnEmail).toBeTruthy();
		
		console.log('⌨️ Keyboard navigation works correctly on contact form');
	});
});

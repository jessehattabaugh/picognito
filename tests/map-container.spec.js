/**
 * End-to-end tests for the map-container component
 * @module tests/map-container
 */

// Import needed Playwright modules
const { test, expect } = require('@playwright/test');

test.describe('Map Container Tests 🗺️', () => {
	test('should load and display map correctly 🚀', async ({ page }) => {
		// Navigate to the page containing the map
		await page.goto('/');

		// Wait for map container to be visible
		const mapContainer = page.locator('map-container');
		await expect(mapContainer).toBeVisible();

		// Wait for the map to be fully loaded
		await page.waitForSelector('.leaflet-container', { state: 'visible' });

		// Verify that the loading indicator is hidden
		const loadingIndicator = page.locator('#map-loading');
		await expect(loadingIndicator).toHaveClass(/hidden/);

		// Verify Leaflet controls are visible
		const zoomControls = page.locator('.leaflet-control-zoom');
		await expect(zoomControls).toBeVisible();

		// Take a screenshot for visual verification
		await page.screenshot({ path: './test-results/map-loaded.png' });
	});

	test('should be keyboard navigable 🔤', async ({ page }) => {
		await page.goto('/');

		// Wait for map to load
		await page.waitForSelector('.leaflet-container', { state: 'visible' });

		// Focus on the zoom in button
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab'); // May need multiple tabs depending on your page structure

		// Check if the zoom in button is focused
		const focusedElement = await page.evaluate(() => document.activeElement.className);

		// Verify focus is on a leaflet control
		expect(focusedElement).toContain('leaflet-control');

		// Activate the control with Enter key
		await page.keyboard.press('Enter');

		// Verify zoom level has changed (this will depend on your implementation)
		// This is a simplified check - you may need to adapt it
		const mapZoom = await page.evaluate(() => {
			const mapComponent = document.querySelector('map-container');
			return mapComponent?.getMap()?.getZoom();
		});

		expect(mapZoom).toBeGreaterThan(12); // Assuming default zoom is 12
	});

	test('should handle window resize responsively 📱', async ({ page }) => {
		await page.goto('/');

		// Wait for map to load
		await page.waitForSelector('.leaflet-container', { state: 'visible' });

		// Get initial map size
		const initialSize = await page.evaluate(() => {
			const container = document.querySelector('.leaflet-container');
			return {
				width: container.clientWidth,
				height: container.clientHeight,
			};
		});

		// Resize viewport to mobile size
		await page.setViewportSize({ width: 375, height: 667 });

		// Wait for resize to take effect
		await page.waitForTimeout(500);

		// Get new map size
		const mobileSize = await page.evaluate(() => {
			const container = document.querySelector('.leaflet-container');
			return {
				width: container.clientWidth,
				height: container.clientHeight,
			};
		});

		// Verify map has resized
		expect(mobileSize.width).toBeLessThan(initialSize.width);
		expect(mobileSize.height).not.toBe(0); // Map should still have height

		// Verify the map is still visible and working
		await expect(page.locator('.leaflet-container')).toBeVisible();
	});
});

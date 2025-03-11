import { expect, test } from '@playwright/test';

test.describe('Map Component 🗺️', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for map initialization
		await page.waitForSelector('map-container', { state: 'attached' });
		console.info('🗺️ 🔄 Waiting for map initialization');
	});

	test('map initializes and displays tiles 🎯', async ({ page }) => {
		const mapContainer = page.locator('map-container');
		await expect(mapContainer).toBeVisible();
		await expect(mapContainer).toHaveAttribute('role', 'application');

		// Wait for Leaflet to initialize
		await page.waitForSelector('.leaflet-container', { state: 'visible' });
		await page.waitForSelector('.leaflet-tile-loaded', { state: 'visible' });

		// Verify attribution
		await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
	});

	test('map supports keyboard navigation ⌨️', async ({ page }) => {
		// Focus the map
		await page.locator('map-container').click();

		// Pan with arrow keys
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press('ArrowDown');

		// Zoom with plus/minus
		await page.keyboard.press('+');

		// Verify zoom level changed
		const zoomLevel = await page.evaluate(() => {
			const container = document.querySelector('map-container');
			return container._map.getZoom();
		});

		expect(zoomLevel).toBeGreaterThan(2);
	});

	test('map respects max bounds 🌍', async ({ page }) => {
		// Try to pan beyond bounds
		const map = page.locator('map-container');
		await map.click();

		// Pan far right multiple times
		for (let i = 0; i < 10; i++) {
			await page.keyboard.press('ArrowRight');
		}

		// Verify longitude is within bounds
		const longitude = await page.evaluate(() => {
			const container = document.querySelector('map-container');
			return container._map.getCenter().lng;
		});

		expect(longitude).toBeLessThanOrEqual(180);
	});

	test('map loads with required controls 🎯', async ({ page }) => {
		// Verify map container exists with ARIA attributes
		const mapContainer = page.locator('map-container');
		await expect(mapContainer).toBeVisible();
		await expect(mapContainer).toHaveAttribute('role', 'application');
		await expect(mapContainer).toHaveAttribute('aria-label');

		// Check map controls
		await expect(page.locator('.leaflet-control-zoom')).toBeVisible();
		await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
	});

	test('keyboard navigation functions correctly ⌨️', async ({ page }) => {
		// Focus map and test controls
		await page.locator('map-container').click();
		await page.keyboard.press('Tab');

		// Verify zoom controls are focusable
		const focusedElement = await page.evaluate(() => document.activeElement?.className);
		expect(focusedElement).toContain('leaflet-control-zoom');

		// Test zoom functionality
		await page.keyboard.press('+');
		const zoomLevel = await page.evaluate(() =>
			document.querySelector('map-container')?._map?.getZoom(),
		);
		expect(zoomLevel).toBeGreaterThan(2);
	});
});

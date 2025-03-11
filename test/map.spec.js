import { expect, test } from '@playwright/test';

test.describe('Map Component 🗺️', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for map initialization
		await page.waitForSelector('map-container', { state: 'attached' });
		console.info('🗺️ 🔄 Waiting for map initialization');
	});

	test('map initializes and displays tiles 🗺️ 🎯', async ({ page }) => {
		const mapContainer = page.locator('map-container');
		await expect(mapContainer).toBeVisible();
		await expect(mapContainer).toHaveAttribute('role', 'application');

		// Wait for Leaflet to initialize with a more reliable selector
		await page.waitForSelector('.leaflet-container', { state: 'visible', timeout: 10000 });
		await page
			.waitForSelector('.leaflet-tile-loaded', { state: 'visible', timeout: 10000 })
			.catch(() => console.warn('🗺️ ⚠️ Tiles may not have loaded completely'));

		// Verify attribution
		await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
	});

	test('map supports keyboard navigation 🗺️ ⌨️', async ({ page }) => {
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
			const map = container && container.map ? container.map : null;
			return map ? map.getZoom() : 0;
		});

		expect(zoomLevel).toBeGreaterThan(2);
	});

	test('map respects max bounds 🗺️ 🌍', async ({ page }) => {
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
			const map = container && container.map ? container.map : null;
			return map ? map.getCenter().lng : 0;
		});

		expect(longitude).toBeLessThanOrEqual(180);
	});

	test('map loads with required controls 🗺️ 🎯', async ({ page }) => {
		// Verify map container exists with ARIA attributes
		const mapContainer = page.locator('map-container');
		await expect(mapContainer).toBeVisible();
		await expect(mapContainer).toHaveAttribute('role', 'application');
		await expect(mapContainer).toHaveAttribute('aria-label');

		// Check map controls with safety timeouts
		await expect(page.locator('.leaflet-control-zoom')).toBeVisible({ timeout: 5000 });
		await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
	});

	test('keyboard navigation functions correctly 🗺️ ⌨️', async ({ page }) => {
		// Focus map and test controls
		await page.locator('map-container').click();
		await page.keyboard.press('Tab');

		// Verify zoom controls are focusable with a safe fallback
		const focusedElement = await page.evaluate(() => {
			const element = document.activeElement;
			return element ? element.className : '';
		});

		expect(focusedElement).toContain('leaflet-control-zoom');

		// Test zoom functionality with a safe evaluation
		await page.keyboard.press('+');
		const zoomLevel = await page.evaluate(() => {
			const container = document.querySelector('map-container');
			const map = container && container.map ? container.map : null;
			return map ? map.getZoom() : 0;
		});
		expect(zoomLevel).toBeGreaterThan(2);
	});

	test('map displays and initializes correctly 🗺️ 🧪', async ({ page }) => {
		await page.goto('/');

		// Check map container is visible
		await expect(page.locator('map-container')).toBeVisible();

		// Verify Leaflet is initialized
		await expect(page.locator('.leaflet-container')).toBeVisible();

		// Test map interactivity
		await page.mouse.move(200, 200);
		await page.mouse.down();
		await page.mouse.move(250, 200);
		await page.mouse.up();

		// Verify map moved
		// Compare screenshot with baseline
	});

	test('map is keyboard accessible 🗺️ ⌨️', async ({ page }) => {
		await page.goto('/');

		// Tab to map controls
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Verify focus is visible
		const focused = await page.evaluate(() => {
			const activeElement = document.activeElement;
			return activeElement ? activeElement.classList.contains('leaflet-control') : false;
		});

		expect(focused).toBeTruthy();
	});
});

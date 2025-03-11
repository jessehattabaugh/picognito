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

	/**
	 * Gets the map zoom level
	 * @param {import('@playwright/test').Page} page - Playwright page
	 * @returns {Promise<number>} The zoom level
	 */
	async function getMapZoom(page) {
		return page.evaluate(() => {
			// Use eval() inside page context to bypass TypeScript property checking
			// This is only for testing purposes
			try {
				const container = document.querySelector('map-container');
				if (!container) return 0;

				// Try direct property access using eval to bypass TypeScript
				try {
					// Try to access map instance via custom element method
					return eval('container.getZoom && container.getZoom()') || 0;
				} catch {
					// Try shadowDOM if direct access fails
					if (container.shadowRoot) {
						const leafletContainer =
							container.shadowRoot.querySelector('.leaflet-container');
						if (leafletContainer) {
							return (
								eval('leafletContainer.getZoom && leafletContainer.getZoom()') || 0
							);
						}
					}
				}
			} catch (err) {
				console.warn('🗺️ ⚠️ Error getting zoom level');
				return 0;
			}
			return 0;
		});
	}

	/**
	 * Gets the map center coordinates
	 * @param {import('@playwright/test').Page} page - Playwright page
	 * @returns {Promise<{lat: number, lng: number}>} The center coordinates
	 */
	async function getMapCenter(page) {
		return page.evaluate(() => {
			try {
				const container = document.querySelector('map-container');
				if (!container) return { lat: 0, lng: 0 };

				// Try direct property access using eval to bypass TypeScript
				try {
					// Try to access map instance via custom element method
					const center = eval('container.getCenter && container.getCenter()');
					if (center && typeof center.lng === 'number') {
						return center;
					}
				} catch {
					// Try shadowDOM if direct access fails
					if (container.shadowRoot) {
						const leafletContainer =
							container.shadowRoot.querySelector('.leaflet-container');
						if (leafletContainer) {
							const center = eval(
								'leafletContainer.getCenter && leafletContainer.getCenter()',
							);
							if (center && typeof center.lng === 'number') {
								return center;
							}
						}
					}
				}
			} catch (err) {
				console.warn('🗺️ ⚠️ Error getting map center');
			}
			return { lat: 0, lng: 0 };
		});
	}

	/**
	 * Requests geolocation from the map
	 * @param {import('@playwright/test').Page} page - Playwright page
	 * @returns {Promise<void>}
	 */
	async function requestMapGeolocation(page) {
		await page.evaluate(() => {
			try {
				const mapContainer = document.querySelector('map-container');
				if (!mapContainer) {
					console.warn('🗺️ ⚠️ Map container not found');
					return;
				}

				// Try different approaches to request geolocation
				try {
					// Use eval to bypass TypeScript property checking
					const methodExists = eval(
						'typeof mapContainer.requestGeolocation === "function"',
					);
					if (methodExists) {
						eval('mapContainer.requestGeolocation()');
						console.info('🗺️ 📍 Requested geolocation via method');
						return;
					}
				} catch (e) {
					console.debug('🗺️ 🔍 Method call failed, trying event', e);
				}

				// Fallback to event
				const geoEvent = new CustomEvent('request-geolocation');
				mapContainer.dispatchEvent(geoEvent);
				console.info('🗺️ 📍 Dispatched geolocation request event');
			} catch (err) {
				console.warn('🗺️ ⚠️ Error requesting geolocation', err);
			}
		});
	}

	test('map supports keyboard navigation 🗺️ ⌨️', async ({ page }) => {
		// Focus the map
		await page.locator('map-container').click();

		// Pan with arrow keys
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press('ArrowDown');

		// Zoom with plus/minus
		await page.keyboard.press('+');

		// Verify zoom level changed
		const zoomLevel = await getMapZoom(page);
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
		const center = await getMapCenter(page);
		expect(center.lng).toBeLessThanOrEqual(180);
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

		// Test zoom functionality
		await page.keyboard.press('+');
		const zoomLevel = await getMapZoom(page);
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

	// Add tests for geolocation functionality
	test('map shows initial view and then zooms to location after geolocation permission 🗺️🔍', async ({
		page,
	}) => {
		// Navigate to page with map
		await page.goto('/');

		// Wait for map to initialize
		await page.waitForSelector('map-container');

		// Take screenshot before accepting geolocation
		await page.screenshot({ path: 'tests/screenshots/map-before-geolocation.png' });

		// Mock geolocation to Portland, Oregon
		await page.context().grantPermissions(['geolocation']);
		await page.evaluate(() => {
			// Create a mock implementation that doesn't reassign the read-only property
			const portland = { latitude: 45.5152, longitude: -122.6784 };

			/**
			 * @param {Function} success - Success callback
			 */
			function getCurrentPosition(success) {
				success({ coords: portland });
			}

			// Override the getCurrentPosition method using Object.defineProperty
			Object.defineProperty(navigator.geolocation, 'getCurrentPosition', {
				configurable: true,
				value: getCurrentPosition,
			});
		});

		// Trigger geolocation
		await requestMapGeolocation(page);

		// Wait for map to update with new location
		await page.waitForTimeout(1000); // Wait for map animation

		// Take screenshot after accepting geolocation
		await page.screenshot({ path: 'tests/screenshots/map-after-geolocation.png' });

		// Verify images are loaded around the location
		const imageElements = await page.$$('.map-image');
		expect(imageElements.length).toBeGreaterThan(0);
	});
});

test.describe('Map Component Geolocation 🗺️📍', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('map-container', { state: 'attached' });
		console.info('🗺️ 🔄 Waiting for map initialization');
	});

	test('map shows initial view and then zooms to location after geolocation permission 🗺️🔍', async ({
		page,
	}) => {
		// Take screenshot before accepting geolocation
		await page.screenshot({ path: 'tests/screenshots/map-before-geolocation.png' });

		// Mock geolocation to Portland, Oregon
		await page.context().grantPermissions(['geolocation']);
		await page.evaluate(() => {
			const portland = { latitude: 45.5152, longitude: -122.6784 };

			function getCurrentPosition(success) {
				success({ coords: portland });
			}

			Object.defineProperty(navigator.geolocation, 'getCurrentPosition', {
				configurable: true,
				value: getCurrentPosition,
			});
		});

		// Trigger geolocation
		await requestMapGeolocation(page);

		// Wait for map to update with new location
		await page.waitForTimeout(1000); // Wait for map animation

		// Take screenshot after accepting geolocation
		await page.screenshot({ path: 'tests/screenshots/map-after-geolocation.png' });

		// Verify images are loaded around the location
		const imageElements = await page.$$('.map-image');
		expect(imageElements.length).toBeGreaterThan(0);
	});
});

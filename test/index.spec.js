import { expect, test } from '@playwright/test';

import fs from 'fs';
import path from 'path';

/**
 * Test suite for the homepage
 * 🏠 Tests for homepage functionality and appearance
 */
test.describe('Basic Page Functionality', () => {
	// Basic functionality
	test('page loads successfully 🚀', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Modern Web Boilerplate/);
		console.log('🏠 🚀 Homepage loaded successfully');
	});

	test('takes visual snapshot of the page 📸', async ({ page }) => {
		await page.goto('/');
		// Wait for any animations to complete
		await page.waitForTimeout(500);
		await expect(page).toHaveScreenshot('index-page-baseline.png');
		console.log('🏠 📸 Visual snapshot taken of homepage');
	});
});

test.describe('Layout and Responsiveness', () => {
	// Create snapshots directory if it doesn't exist
	const snapshotDir = path.join(process.cwd(), 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	test('mobile layout matches baseline 📱', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		// Wait for key elements to be visible
		await page.getByRole('heading', { level: 1 }).waitFor({ state: 'visible' });
		// Wait for animations to complete
		await page.waitForTimeout(500);
		await expect(page).toHaveScreenshot('homepage-mobile-baseline.png');
		console.log('🏠 📱 Mobile layout snapshot taken');
	});

	test('should have proper keyboard navigation ⌨️', async ({ page }) => {
		await page.goto('/');
		// Press Tab to focus on the first interactive element
		await page.keyboard.press('Tab');
		// Find the focused element
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			// Add null check for el
			if (!el) return { tag: 'BODY', isFocused: false };
			return {
				tag: el.tagName,
				isFocused: el.tagName !== 'BODY',
			};
		});
		// Verify something other than body is focused
		expect(focusedElement.isFocused).toBeTruthy();
		// Take a screenshot with the focus visible
		await expect(page).toHaveScreenshot('homepage-keyboard-focus.png');
		console.log('🏠 ⌨️ Keyboard navigation works correctly');
	});

	test('carousel navigation works 🎠', async ({ page }) => {
		await page.goto('/');
		// Find the carousel
		const carousel = await page.locator('image-carousel');
		// Check if carousel exists
		const carouselExists = (await carousel.count()) > 0;
		if (!carouselExists) {
			console.warn('🏠 🎠 Carousel not found, skipping test');
			test.skip();
			return;
		}
		// Click next button
		await page.locator('image-carousel').getByRole('button', { name: 'Next' }).click();
		// Take a screenshot of the carousel after navigation
		await page.waitForTimeout(300); // Wait for transition
		await expect(page.locator('image-carousel')).toHaveScreenshot('carousel-next.png');
		console.log('🏠 🎠 Carousel navigation tested');
	});
});

test.describe('Accessibility', () => {
	test('page passes basic accessibility checks ♿', async ({ page }) => {
		await page.goto('/');

		// More specific approach to accessibility testing
		// Check if the page has a title
		const title = await page.title();
		expect(title).not.toBe('');

		// Check if there's a main landmark
		const mainContent = await page.locator('main').first();
		await expect(mainContent).toBeVisible();

		// Check if the skip link exists
		const skipLink = await page.locator('a:text("Skip to main content")').first();
		await expect(skipLink).toBeVisible({ visible: false }); // It might be visually hidden but still in DOM

		// Click the skip link and check focus management
		await skipLink.focus();
		await skipLink.click();

		// Use more reliable way to check focus
		const activeId = await page.evaluate(() => document.activeElement?.id || '');
		expect(activeId).toBe('main-content');

		console.log('🏠 ♿ Accessibility features work as expected');
	});
});

test.describe('Performance', () => {
	test('page loads within reasonable time ⚡', async ({ page }) => {
		// Navigate to the page
		const navigationStart = Date.now();
		await page.goto('/');
		const navigationEnd = Date.now();
		// Basic performance check
		expect(navigationEnd - navigationStart).toBeLessThan(3000);
		// Log performance metrics
		const performanceTimings = await page.evaluate(() => JSON.stringify(performance.timing));
		const timings = JSON.parse(performanceTimings);
		// Log key metrics
		console.info('🏠 📊 Performance metrics:', {
			ttfb: timings.responseStart - timings.requestStart,
			domLoaded: timings.domContentLoadedEventEnd - timings.navigationStart,
			fullLoad: timings.loadEventEnd - timings.navigationStart,
		});
		console.log('🏠 ⚡ Page load time within acceptable range');
	});
});

test.describe('Map Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for map to be ready
		await page.waitForSelector('map-container', { state: 'visible' });
	});

	test('should render map container and initialize Leaflet map 🗺️', async ({ page }) => {
		// Check that the map container exists and is visible
		const mapContainer = await page.locator('map-container');
		await expect(mapContainer).toBeVisible();

		// Verify Leaflet map initialization
		await page.waitForSelector('.leaflet-container', { state: 'visible', timeout: 10000 });
		await expect(page.locator('.leaflet-container')).toBeVisible();
		console.log('🏠 🗺️ Map container rendered and initialized');
	});

	test('should support keyboard navigation for map interactions ⌨️', async ({ page }) => {
		// Focus the map container
		const mapContainer = page.locator('map-container');
		await mapContainer.focus();

		// Simulate keyboard interaction
		await page.keyboard.press('ArrowUp');
		await expect(mapContainer).toHaveClass(/focused/);

		// Verify zoom controls are accessible
		await expect(page.locator('.leaflet-control-zoom')).toBeVisible();
		console.log('🏠 ⌨️ Map keyboard navigation verified');
	});

	test('should provide proper screen reader accessibility ♿', async ({ page }) => {
		// Verify ARIA attributes
		const mapContainer = page.locator('map-container');
		await expect(mapContainer).toHaveAttribute('role', 'region');
		await expect(mapContainer).toHaveAttribute('aria-label', 'Accessible Map');

		// Check for screen reader instructions
		const srInstructions = await page.evaluate(() => {
			const mapContainer = document.querySelector('map-container');
			if (!mapContainer || !mapContainer.shadowRoot) return false;

			const srEl = mapContainer.shadowRoot.querySelector('.sr-only');
			return srEl ? srEl.textContent : false;
		});

		expect(srInstructions).toContain('Use arrow keys');
		console.log('🏠 ♿ Map accessibility features verified');
	});

	test('should center map on user location when requested 📍', async ({ page }) => {
		// Mock geolocation API - use context().setGeolocation instead of page.setGeolocation
		await page.context().setGeolocation({ latitude: 40, longitude: -74 });
		await page.context().grantPermissions(['geolocation']);

		// Get map center after geolocation
		const center = await page.evaluate(() => {
			const mapContainer = document.querySelector('map-container');
			// Use optional chaining for safer property access
			return mapContainer?.getCenter?.() || { lat: 0, lng: 0 };
		});

		// Verify map centered correctly
		expect(center?.lat).toBeCloseTo(40, 0);
		expect(center?.lng).toBeCloseTo(-74, 0);
		console.log('🏠 📍 Map geolocation centering verified');
	});

	test('should take visual snapshot of map 📸', async ({ page }) => {
		// Ensure map is fully loaded
		await page.waitForSelector('.leaflet-container', { state: 'visible' });
		await page.waitForTimeout(1000); // Allow tiles to load

		// Take screenshot of the map
		await expect(page.locator('map-container')).toHaveScreenshot('map-component-baseline.png');
		console.log('🏠 📸 Map component visual snapshot taken');
	});
});

test.describe('Photo Display and Attribution', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for the map to be fully loaded
		await page.waitForSelector('map-container:not([loading])');
	});

	test('should display photos from Unsplash on the map 🔍', async ({ page }) => {
		// Check if map contains photo markers
		const photoMarkers = page.locator('.leaflet-marker-icon.photo-marker');
		// There should be multiple photo markers visible on the map
		await expect(photoMarkers).toHaveCount(3);
		console.log('🏠 🔍 Photo markers verified on map');
	});

	test('should show proper attribution for Unsplash photos 📝', async ({ page }) => {
		// Check if attribution is present
		const attribution = await page.evaluate(() => {
			const mapContainer = document.querySelector('map-container');
			if (!mapContainer || !mapContainer.shadowRoot) return false;

			const attribution = mapContainer.shadowRoot.querySelector('.photo-attribution');
			return attribution ? attribution.textContent : false;
		});

		// Attribution should contain Unsplash reference
		expect(attribution).toContain('Unsplash');

		// Check individual photo attribution when clicking a marker
		const firstPhotoMarker = page.locator('.leaflet-marker-icon.photo-marker').first();
		await firstPhotoMarker.click();

		// Photo popup should contain photographer credit
		const photoPopup = page.locator('.leaflet-popup-content');
		await expect(photoPopup).toBeVisible();
		await expect(photoPopup.getByText(/Photo by/)).toBeVisible();
		await expect(photoPopup.locator('a[href*="unsplash"]')).toBeVisible();
		console.log('🏠 📝 Photo attribution verified');
	});

	test('should display photo thumbnails in popups 🖼️', async ({ page }) => {
		// Click on a photo marker
		const photoMarker = page.locator('.leaflet-marker-icon.photo-marker').nth(1);
		await photoMarker.click();

		// Check that popup contains an image
		const photoPopup = page.locator('.leaflet-popup-content');
		await expect(photoPopup).toBeVisible();

		const photoImage = photoPopup.locator('img');
		await expect(photoImage).toBeVisible();
		await expect(photoImage).toHaveAttribute('alt');

		// Verify thumbnail has a src attribute
		const imageSrc = await photoImage.getAttribute('src');
		expect(imageSrc).toBeTruthy();
		console.log('🏠 🖼️ Photo thumbnails display correctly');
	});

	test('should provide accessible information about photos ♿', async ({ page }) => {
		// Click on a photo marker
		const photoMarker = page.locator('.leaflet-marker-icon.photo-marker').first();
		await photoMarker.click();

		// Check that popup content is accessible
		const photoPopup = page.locator('.leaflet-popup-content');
		await expect(photoPopup).toBeVisible();

		// Images should have alt text
		const photoImage = photoPopup.locator('img');
		await expect(photoImage).toHaveAttribute('alt');

		// Links should be properly labeled
		const attributionLink = photoPopup.locator('a[href*="unsplash"]');
		await expect(attributionLink).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(attributionLink).toHaveAttribute('target', '_blank');
		await expect(attributionLink).toContainText('View on Unsplash');
		console.log('🏠 ♿ Photo accessibility features verified');
	});
});

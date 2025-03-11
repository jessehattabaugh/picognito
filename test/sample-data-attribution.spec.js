import { expect, test } from '@playwright/test';

/**
 * Tests for sample data from public APIs with proper attribution
 * @fileoverview Verifies that the map is populated with photos from APIs and shows attribution
 */

test.describe('Sample API Data Attribution', () => {
	/**
	 * Test setup - navigates to the map page before each test
	 */
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for the map to be fully loaded
		await page.waitForSelector('map-container:not([loading])');
	});

	test('should display photos from Unsplash on the map', async ({ page }) => {
		// 🗺️🔍 Check if map contains photo markers
		const photoMarkers = page.locator('.leaflet-marker-icon.photo-marker');

		// There should be multiple photo markers visible on the map
		await expect(photoMarkers).toHaveCount({ minimum: 3 });
	});

	test('should show proper attribution for Unsplash photos', async ({ page }) => {
		// 🗺️📝 Check if attribution is present
		const attribution = page.locator('.photo-attribution');

		// Attribution should be visible and contain Unsplash reference
		await expect(attribution).toBeVisible();
		await expect(attribution).toContainText('Unsplash');

		// Check individual photo attribution when clicking a marker
		const firstPhotoMarker = page.locator('.leaflet-marker-icon.photo-marker').first();
		await firstPhotoMarker.click();

		// Photo popup should contain photographer credit
		const photoPopup = page.locator('.photo-popup');
		await expect(photoPopup).toBeVisible();
		await expect(photoPopup.locator('.photo-credit')).toContainText('Photo by');
		await expect(photoPopup.locator('.attribution-link')).toHaveAttribute(
			'href',
			/unsplash\.com/,
		);
	});
});

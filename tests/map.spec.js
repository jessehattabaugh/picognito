import { expect, test } from '@playwright/test';

test('map displays and loads tiles 🗺️ 🎯', async ({ page }) => {
	await page.goto('/');

	// Check if map container exists
	await expect(page.locator('map-container')).toBeVisible();

	// Verify Leaflet map is initialized
	await expect(page.locator('.leaflet-container')).toBeVisible();

	// Verify tiles are loaded
	await expect(page.locator('.leaflet-tile-loaded')).toBeVisible();
});

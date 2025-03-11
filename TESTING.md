# Picognito Testing Guide

## 🚦 Testing Philosophy

Testing in Picognito follows a pragmatic end-to-end approach. We exclusively create tests that interact with real HTML pages through the user interface, just as actual users would. Every feature begins with a failing test, followed by the minimal code needed to make it pass according to Test-Driven Development (TDD) principles.

- **User-Centric Testing:** Test only what actual users will see and interact with
- **End-to-End Focus:** No unit tests, mocks, or fixtures—only real page interactions
- **Real Pages Only:** Test actual HTML files that are part of the website
- **Isolate State:** Tests should not depend on each other; each should set up its state independently.
- **Prefer using explicit waits:** Leverage built-in waiting mechanisms provided by Playwright like auto-waiting and `await page.waitForSelector()`
- **Keep it Simple** Avoid writing overly granular tests that add little value and significantly increase runtime.


## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test index.spec.js

# Run tests with UI mode
npx playwright test --ui
```

## 📸 Screenshot Testing Workflow

Screenshot testing captures visual regressions. The workflow is:

1. Tests capture screenshots using Playwright's `toHaveScreenshot()` API
2. New screenshots are saved with `.tmp.` in their filename
3. Screenshots with `.tmp.` are ignored by git (via `.gitignore`)
4. When satisfied with test results, accept them as baselines
5. Baseline screenshots are used for PWA manifest

### Taking Screenshots

```js
// Take a screenshot of the page
await expect(page).toHaveScreenshot('page-name-baseline.png');

// For responsive testing include viewport size
await page.setViewportSize({ width: 375, height: 667 });
await expect(page).toHaveScreenshot('page-name-mobile-baseline.png');
```

### Managing Screenshots

```bash
# Accept new screenshots as baselines:
npm run accept

# Build will automatically copy approved screenshots for PWA manifest
npm run build
```

## ⚙️ Test Structure

- **File Naming**: Each test file corresponds to an actual `.html` file in `/www`
- **Test Grouping**: Use `describe` for feature grouping and `test`/`it` for specific user scenarios, Group related tests logically (by feature, component, or user journey). Use descriptive names that clearly indicate the test’s purpose and expected outcome.
- **Accessible Selectors**: Use selectors that select for attributes that are needed by screenreaders (like ARIA Roles) to include accessibility checking in every test
- **Assertions**: Make clear, specific assertions about what users would see or experience

Example test structure:

```js
// test/map-page.spec.js
import { test, expect } from '@playwright/test';

test.describe('Map Page', () => {
	test('should display the map when user visits the page', async ({ page }) => {
		// Navigate to the actual page
		await page.goto('/map.html');

		// Verify what a user would see
		await expect(page.locator('.leaflet-container')).toBeVisible();
		await expect(page.locator('.leaflet-control-zoom')).toBeVisible();
	});

	test('should show user location when permission is granted', async ({ page }) => {
		// Mock geolocation for testing
		await page.setGeolocation({ latitude: 51.507, longitude: -0.127 });
		await page.context().grantPermissions(['geolocation']);

		// Navigate to the page
		await page.goto('/map.html');

		// Click the "Find my location" button that a user would click
		await page.click('#locate-me-button');

		// Verify the map centers on user's location (what the user would see)
		const mapCenter = await page.evaluate(() => {
			const mapElement = document.querySelector('map-container');
			return mapElement?.getCenter?.();
		});
		expect(mapCenter?.lat).toBeCloseTo(51.507, 1);
		expect(mapCenter?.lng).toBeCloseTo(-0.127, 1);
	});
});
```

## 🧰 Testing Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [STYLE_GUIDE.md](STYLE_GUIDE.md) - Coding standards that apply to tests
- [ARCHITECTURE.md](ARCHITECTURE.md) - Understanding the system under test

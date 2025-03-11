# Picognito Testing Guide

## 🚦 Testing Philosophy

Testing in Picognito follows strict Test-Driven Development (TDD) principles. Every feature begins with a failing test, followed by the minimal code needed to make it pass.

1. **Red**: Write a failing test for new functionality or bug
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests passing

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

- **File Naming**: Use descriptive names with `.spec.js` suffix
- **Test Grouping**: Use `describe` for feature grouping and `test`/`it` for specific scenarios
- **Assertions**: Make clear, specific assertions using Playwright's expect API

Example test structure:

```js
// test/feature.spec.js
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
	test('should behave correctly in normal conditions', async ({ page }) => {
		// Setup
		await page.goto('/feature');

		// Action
		await page.click('button');

		// Assertion
		await expect(page.locator('.result')).toHaveText('Success');
	});

	test('should handle edge cases appropriately', async ({ page }) => {
		// ...
	});
});
```

## 📊 Test Coverage Expectations

- **Unit Tests**: Core utilities and helpers
- **Component Tests**: Web component functionality in isolation
- **Integration Tests**: Component interactions and data flows
- **E2E Tests**: Complete user flows and scenarios
- **Accessibility Tests**: WCAG compliance using Playwright's accessibility tools
- **Visual Tests**: UI appearance using screenshot comparisons
- **Performance Tests**: Load time and responsiveness metrics

## 🔄 Development Workflow

1. Start by writing tests in the `/test` directory
2. Run tests to verify they fail properly (Red phase)
3. Implement minimal code in `/www` to make tests pass (Green phase)
4. Refine implementation while maintaining test coverage (Refactor phase)
5. Document changes in CHANGELOG.md

## 🧰 Testing Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [STYLE_GUIDE.md](STYLE_GUIDE.md) - Coding standards that apply to tests
- [ARCHITECTURE.md](ARCHITECTURE.md) - Understanding the system under test

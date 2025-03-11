/**
 * @typedef {import('@playwright/test').Page} Page
 */

/**
 * Waits for all animations to complete on the page
 * @param {Page} page - The Playwright page object
 * @returns {Promise<void>}
 */
export async function waitForAnimations(page) {
	await page.evaluate(() => {
		const animations = document.getAnimations();
		if (animations && animations.length) {
			return Promise.all([...animations].map((animation) => animation.finished));
		}
		return Promise.resolve();
	});
	await page.waitForTimeout(100);
}

/**
 * Ensures consistent focus behavior across browsers
 * @param {Page} page - The Playwright page object
 * @returns {Promise<void>}
 */
export async function ensureProperFocus(page) {
	await page.evaluate(() => {
		if (document.activeElement === document.body) {
			const firstFocusable = document.querySelector(
				'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			if (firstFocusable instanceof HTMLElement) {
				firstFocusable.focus();
			}
		}
	});
}

/**
 * Takes a stable screenshot by waiting for animations and network
 * @param {Page} page - The Playwright page object
 * @param {string} name - The filename for the screenshot
 * @returns {Promise<Buffer|null>}
 */
export async function takeStableScreenshot(page, name) {
	await page.waitForLoadState('networkidle');
	await waitForAnimations(page);
	await page.waitForTimeout(500);
	await page.evaluate(() => {
		return document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
	});
	try {
		return await page.screenshot({ path: name, fullPage: true });
	} catch (error) {
		console.error('📷 ❌ Error taking screenshot:', error);
		return null;
	}
}

/**
 * @typedef {import('@playwright/test').Page} Page
 */

/**
 * Waits for all animations to complete on the page
 * @param {Page} page
 * @returns {Promise<void>}
 */
export async function waitForAnimations(page) {
	await page.evaluate(() =>
		Promise.all([...document.getAnimations()].map((animation) => animation.finished)),
	);
	await page.waitForTimeout(100);
}

/**
 * Ensures consistent focus behavior across browsers
 * @param {Page} page
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
 * @param {Page} page
 * @param {string} name
 * @returns {Promise<Buffer>}
 */
export async function takeStableScreenshot(page, name) {
	await page.waitForLoadState('networkidle');
	await waitForAnimations(page);
	await page.waitForTimeout(500);
	await page.evaluate(() => document.fonts.ready);
	return page.screenshot({ path: name, fullPage: true });
}

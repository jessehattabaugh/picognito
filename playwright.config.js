// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Get base URL from environment variable or use default
 * This allows testing different environments (local, staging, production)
 */
const getBaseUrl = () => {
	if (process.env.TEST_ENV === 'staging') {
		return process.env.STAGING_URL || 'https://staging.example.com';
	}
	return process.env.BASE_URL || 'http://localhost:3000';
};

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './test',
	timeout: 30 * 1000,
	expect: {
		timeout: 5000,
		// Configure screenshot comparison
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.2, // More tolerant comparison
			threshold: 0.3,
			animations: 'disabled',
			scale: 'css',
		},
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: getBaseUrl(),
		actionTimeout: 0,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		viewport: { width: 1280, height: 720 }, // Add default viewport
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
				viewport: { width: 1280, height: 720 },
			},
		},
	],

	webServer: {
		command: 'npm run start',
		port: 3000,
		reuseExistingServer: !process.env.CI,
		timeout: 60 * 1000, // Increase server startup timeout
	},
	testIgnore: ['**/performance.spec.js', '**/accessibility.spec.js'],
});

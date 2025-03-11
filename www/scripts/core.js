/**
 * Core JavaScript for shared components
 * 🏛️ Handles registration of core site components
 */

import { SiteFooter } from '/components/site-footer.js';
import { SiteHeader } from '/components/site-header.js';

// Register core custom elements if not already registered
if (!customElements.get('site-header')) {
	customElements.define('site-header', SiteHeader);
	console.info('🏛️ 📝', 'Site header component registered');
}

if (!customElements.get('site-footer')) {
	customElements.define('site-footer', SiteFooter);
	console.info('🏛️ 📝', 'Site footer component registered');
}

/**
 * Update dynamic content on the page
 */
function updateDynamicContent() {
	// Update current year in footer
	const yearElement = document.getElementById('current-year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear().toString();
	}
}

// Initialize page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	updateDynamicContent();
	console.info('🏛️ ✅', 'Core components initialized');
});

// Support for browsers that don't emit DOMContentLoaded when scripts are loaded with defer
if (document.readyState === 'interactive' || document.readyState === 'complete') {
	updateDynamicContent();
	console.info('🏛️ ✅', 'Core components initialized (document already loaded)');
}

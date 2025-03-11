/**
 * Main JavaScript for the homepage
 * 🏠 Handles components and interactions for the index page
 */

/**
 * @typedef {import('../components/image-carousel.js').ImageCarousel} ImageCarousel
 * @typedef {import('../components/map-container.js').MapContainer} MapContainer
 * @typedef {CustomEvent<{index: number, total: number}>} SlideChangeEvent
 */

// Import web components
import { CarouselItem } from '/components/carousel-item.js';
import { ImageCarousel as ImageCarouselComponent } from '/components/image-carousel.js';
import { MapContainer as MapContainerComponent } from '/components/map-container.js';
import { SiteFooter } from '/components/site-footer.js';
import { SiteHeader } from '/components/site-header.js';

// Register custom elements if not already registered
if (!customElements.get('site-header')) {
	customElements.define('site-header', SiteHeader);
}

if (!customElements.get('site-footer')) {
	customElements.define('site-footer', SiteFooter);
}

if (!customElements.get('image-carousel')) {
	customElements.define('image-carousel', ImageCarouselComponent);
}

if (!customElements.get('carousel-item')) {
	customElements.define('carousel-item', CarouselItem);
}

if (!customElements.get('map-container')) {
	customElements.define('map-container', MapContainerComponent);
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

/**
 * Setup event listeners for page interactions
 * @returns {void}
 */
function setupEventListeners() {
	/** @type {ImageCarousel | null} */
	const carousel = document.querySelector('image-carousel');
	if (carousel) {
		carousel.addEventListener(
			'slide-change',
			/** @param {SlideChangeEvent} e */ (e) => {
				const { index, total } = e.detail;
				console.log('🎠 📊', `Slide changed to ${index} of ${total}`);
			},
		);
	}

	/** @type {MapContainer | null} */
	const mapContainer = document.querySelector('map-container');
	if (mapContainer) {
		console.info('🗺️ 🔍', 'Map container found and initialized');
		mapContainer.addEventListener('map-ready', () => {
			console.log('🗺️ ✅', 'Map is ready for interaction');
		});
	}

	const ctaButton = document.querySelector('.cta-button');
	if (ctaButton) {
		ctaButton.addEventListener('click', () => {
			console.debug('🔘 CTA button clicked');
		});
	}
}

// Initialize page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	updateDynamicContent();
	setupEventListeners();
	console.log('🏠 Homepage initialized successfully');
});

// Support for browsers that don't emit DOMContentLoaded when scripts are loaded with defer
if (document.readyState === 'interactive' || document.readyState === 'complete') {
	updateDynamicContent();
	setupEventListeners();
	console.log('🏠 Homepage initialized (document already loaded)');
}

// Export key functions for potential reuse or testing
export { updateDynamicContent, setupEventListeners };

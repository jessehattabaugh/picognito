/**
 * Map container web component that integrates with Leaflet
 * @module components/map-container
 */

// Map emoji for console logging
const MAP_EMOJI = '🗺️';

/**
 * Map container web component that handles map initialization and interactions
 * @customElement map-container
 */
class MapContainer extends HTMLElement {
	/**
	 * @type {import('leaflet').Map|null}
	 */
	#map = null;

	/**
	 * @type {boolean}
	 */
	#initialized = false;

	/**
	 * Observed attributes for the component
	 * @returns {string[]} Array of attribute names to observe
	 */
	static get observedAttributes() {
		return ['latitude', 'longitude', 'zoom'];
	}

	/**
	 * Create a new MapContainer element
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		// Default map settings
		this.latitude = 51.505;
		this.longitude = -0.09;
		this.zoom = 13;
	}

	/**
	 * Component connected callback lifecycle method
	 */
	connectedCallback() {
		console.info(`${MAP_EMOJI} 🔌 Map container connected to DOM`);
		this.render();

		// Initialize map after render to ensure container exists
		this.shadowRoot.addEventListener(
			'transitionend',
			() => {
				// Only initialize once
				if (!this.#initialized) {
					this.initializeMap();
				}
			},
			{ once: true },
		);

		// Set visible after a brief delay to ensure smooth animation
		setTimeout(() => {
			this.classList.add('visible');
		}, 10);
	}

	/**
	 * Component attribute changed callback lifecycle method
	 * @param {string} name - Name of the changed attribute
	 * @param {string} oldValue - Previous attribute value
	 * @param {string} newValue - New attribute value
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;

		switch (name) {
			case 'latitude':
				this.latitude = parseFloat(newValue);
				break;
			case 'longitude':
				this.longitude = parseFloat(newValue);
				break;
			case 'zoom':
				this.zoom = parseInt(newValue, 10);
				break;
		}

		// Update map center if map is already initialized
		if (this.#map && this.#initialized) {
			this.#map.setView([this.latitude, this.longitude], this.zoom);
			console.log(`${MAP_EMOJI} 🎯 Map view updated`, {
				lat: this.latitude,
				lng: this.longitude,
				zoom: this.zoom,
			});
		}
	}

	/**
	 * Render the component's HTML
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					height: 100%;
					width: 100%;
					opacity: 0;
					transition: opacity 0.3s ease-in-out;
				}

				:host(.visible) {
					opacity: 1;
				}

				.map-container {
					height: 100%;
					width: 100%;
				}

				/* Import Leaflet CSS */
				@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
			</style>
			<div class="map-container" part="container" aria-label="Interactive map">
				<slot></slot>
			</div>
		`;
	}

	/**
	 * Initialize the Leaflet map
	 */
	async initializeMap() {
		if (this.#initialized) return;

		try {
			// Import Leaflet dynamically
			const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');

			const container = this.shadowRoot.querySelector('.map-container');

			// Initialize map
			this.#map = L.map(container, {
				center: [this.latitude, this.longitude],
				zoom: this.zoom,
				zoomControl: false, // We'll add custom accessible controls
				keyboard: true, // Enable keyboard navigation
				tap: true, // Enable tap handler for touch devices
			});

			// Add accessible zoom controls
			L.control
				.zoom({
					position: 'bottomright',
					zoomInTitle: 'Zoom in to show more detail',
					zoomOutTitle: 'Zoom out to show larger area',
				})
				.addTo(this.#map);

			// Add tile layer
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19,
				// Improve accessibility
				accessToken: 'not-required-for-osm',
			}).addTo(this.#map);

			// Mark as initialized
			this.#initialized = true;
			this.setAttribute('aria-busy', 'false');
			this.dispatchEvent(
				new CustomEvent('map-ready', {
					bubbles: true,
					composed: true,
					detail: { map: this.#map },
				}),
			);

			console.log(`${MAP_EMOJI} 🚀 Map initialized successfully`, {
				lat: this.latitude,
				lng: this.longitude,
				zoom: this.zoom,
				container: container,
			});
		} catch (error) {
			console.error(`${MAP_EMOJI} 💥 Failed to initialize map`, error);
			this.dispatchEvent(
				new CustomEvent('map-error', {
					bubbles: true,
					composed: true,
					detail: { error },
				}),
			);
		}
	}

	/**
	 * Get access to the Leaflet map instance
	 * @returns {import('leaflet').Map|null} Leaflet map instance or null if not initialized
	 */
	getMap() {
		return this.#map;
	}
}

// Register the web component
customElements.define('map-container', MapContainer);

export default MapContainer;

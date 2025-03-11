/**
 * @typedef {import('leaflet').Map} LeafletMap
 * @typedef {import('leaflet').TileLayer} TileLayer
 * @typedef {import('leaflet').LatLngBounds} LatLngBounds
 * @typedef {import('leaflet').MapOptions} MapOptions
 * @typedef {import('leaflet').TileLayerOptions} TileLayerOptions
 */

class MapContainer extends HTMLElement {
	/** @type {LeafletMap|null} */
	#map = null;

	/** @type {TileLayer|null} */
	#tileLayer = null;

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		console.info('🗺️ 🎉 Initializing map container');
	}

	/**
	 * Called when element is connected to DOM
	 */
	connectedCallback() {
		this.setAttribute('data-state', 'initializing');
		this.#initializeMap();
		this.setAttribute('data-state', 'ready');
		console.info('🗺️ ✅ Map initialization complete');
	}

	/**
	 * Initialize the Leaflet map with all required features
	 * @returns {void}
	 */
	#initializeMap() {
		// Add screen reader description
		this.setAttribute('aria-label', 'Interactive map for sharing and viewing photos');
		this.setAttribute('role', 'application');
		this.setAttribute('tabindex', '0');

		/** @type {MapOptions} */
		const mapOptions = {
			zoomControl: true,
			attributionControl: true,
			keyboard: true,
			zoomSnap: 0.5,
			maxBounds: [
				[-90, -180],
				[90, 180],
			],
			minZoom: 2,
			keyboardPanDelta: 100,
		};

		this.#map = L.map(this, mapOptions).setView([0, 0], 2);

		if (!this.#map) {
			console.error('🗺️ ❌ Failed to initialize map');
			return;
		}

		/** @type {TileLayerOptions} */
		const tileOptions = {
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19,
			noWrap: true,
		};

		this.#tileLayer = L.tileLayer(
			'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			tileOptions,
		).addTo(this.#map);

		this.#addA11yFeatures();
		console.info('🗺️ 📍 Map initialized with accessibility support');
	}

	/**
	 * Add accessibility features to the map
	 * @returns {void}
	 */
	#addA11yFeatures() {
		if (!this.#map) return;

		L.control
			.attribution({
				prefix: 'Use arrow keys to pan, +/- to zoom',
			})
			.addTo(this.#map);

		this.#map.on('zoomend', () => {
			if (!this.#map) return;
			const zoom = this.#map.getZoom();
			this.setAttribute(
				'aria-label',
				`Map at zoom level ${zoom}. Use arrow keys to pan, plus and minus to zoom.`,
			);
		});
	}

	/**
	 * Clean up map resources when element is removed
	 * @returns {void}
	 */
	disconnectedCallback() {
		if (this.#map) {
			this.#map.remove();
			this.#map = null;
			this.#tileLayer = null;
			console.info('🗺️ 🧹 Map cleaned up');
		}
	}
}

customElements.define('map-container', MapContainer);

/**
 * @typedef {import('leaflet').Map} LeafletMap
 * @typedef {import('leaflet').TileLayer} TileLayer
 * @typedef {import('leaflet').LatLngBounds} LatLngBounds
 * @typedef {import('leaflet').MapOptions} MapOptions
 * @typedef {import('leaflet').TileLayerOptions} TileLayerOptions
 */

// Import Leaflet as an ES module
import * as L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';

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

	/**
	 * Renders component HTML structure
	 * @returns {void}
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					width: 100%;
					height: 100%;
				}

				#map {
					height: 100%;
					width: 100%;
					z-index: 1;
				}

				/* Accessibility styles */
				.sr-only {
					position: absolute;
					width: 1px;
					height: 1px;
					padding: 0;
					margin: -1px;
					overflow: hidden;
					clip: rect(0, 0, 0, 0);
					border: 0;
				}

				/* Responsive styles */
				@media (max-width: 768px) {
					/* Mobile optimizations */
				}
			</style>
			<div id="map" role="application" aria-label="Interactive map showing photos around you"></div>
			<slot></slot>
		`;
	}
}

customElements.define('map-container', MapContainer);

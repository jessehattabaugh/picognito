// www/components/map-container.js
import L from 'leaflet';
// If you need CSS as well, add this to your HTML or import it separately
// <link rel="stylesheet" href="node_modules/leaflet/dist/leaflet.css" />

/**
 * Map container web component that encapsulates Leaflet functionality
 * @class MapContainer
 * @extends HTMLElement
 */
export class MapContainer extends HTMLElement {
	/**
	 * Creates an instance of MapContainer
	 * @constructor
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.map = null; // Store map instance
	}

	/**
	 * Called when element is connected to DOM
	 * @returns {void}
	 */
	connectedCallback() {
		this.render();
		this.initMap();
	}

	/**
	 * Initializes Leaflet map with accessibility features
	 * @returns {Promise<void>}
	 */
	async initMap() {
		if (!this.shadowRoot) return;
		try {
			const mapElement = this.shadowRoot.getElementById('map');
			if (!mapElement) return;
			this.map = L.map(mapElement).setView([51.505, -0.09], 13);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(this.map);
			console.info('🗺️ 🚀 Map initialized');

			// Dispatch event when map is ready
			this.dispatchEvent(new CustomEvent('map-ready', { bubbles: true }));
		} catch (error) {
			console.error('🗺️ ❌ Failed to load Leaflet:', error);
		}
	}

	/**
	 * Renders component HTML structure
	 * @returns {void}
	 */
	render() {
		if (!this.shadowRoot) return;
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
				@media (max-width: 768px) {
					/* Mobile optimizations */
				}
			</style>
			<div id="map" role="application" aria-label="Interactive map showing photos around you"></div>
			<slot></slot>
		`;
	}

	/**
	 * Gets the current map zoom level
	 * @returns {number} The current zoom level
	 */
	getZoom() {
		return this.map ? this.map.getZoom() : 0;
	}

	/**
	 * Gets the current map center
	 * @returns {{lat: number, lng: number}} The center coordinates
	 */
	getCenter() {
		return this.map ? this.map.getCenter() : { lat: 0, lng: 0 };
	}

	/**
	 * Requests geolocation and centers map on user position
	 * @returns {Promise<void>}
	 */
	async requestGeolocation() {
		console.info('🗺️ 📍 Requesting geolocation');
		if (!navigator.geolocation) {
			console.warn('🗺️ ⚠️ Geolocation not supported');
			return;
		}

		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});

			const { latitude, longitude } = position.coords;
			if (this.map) {
				this.map.setView([latitude, longitude], 15);
				console.info('🗺️ 📍 Map centered on user location');
			}
		} catch (error) {
			console.error('🗺️ ❌ Geolocation error:', error);
		}
	}
}

// Remove this line since we're now registering the component in index.js
// customElements.define('map-container', MapContainer);
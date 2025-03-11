import L from 'leaflet';

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
		/** @type {import('leaflet').Map | null} */
		this.map = null;
	}

	/**
	 * Called when element is connected to DOM
	 * @returns {void}
	 */
	connectedCallback() {
		this.render();
		this.initMap();
		// Set ARIA attributes
		this.setAttribute('role', 'region');
		this.setAttribute('aria-label', 'Accessible Map');
		this.setAttribute(
			'aria-description',
			'Interactive map showing photos from around the world',
		);
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

			// Create a light DOM container for markers
			const markersContainer = document.createElement('div');
			markersContainer.className = 'leaflet-marker-pane';
			mapElement.appendChild(markersContainer);

			// Create attribution container
			const attributionDiv = document.createElement('div');
			attributionDiv.className = 'photo-attribution';
			attributionDiv.textContent = 'Photos provided by Unsplash';
			mapElement.appendChild(attributionDiv);

			// Create map instance with accessibility options
			this.map = L.map(mapElement, {
				preferCanvas: false, // Force DOM markers for testing
				keyboard: true, // Enable keyboard navigation
				zoomControl: true, // Show zoom controls for better accessibility
			}).setView([51.505, -0.09], 13);

			// Add tile layer with attribution
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(this.map);

			// Add screen reader instructions
			const srInstructions = document.createElement('div');
			srInstructions.className = 'sr-only';
			srInstructions.textContent =
				'Use arrow keys to pan, plus and minus to zoom, and enter to interact with markers';
			mapElement.appendChild(srInstructions);

			console.info('🗺️ 🚀 Map initialized');

			// Load photos after map is ready
			await this.loadPhotos();

			this.dispatchEvent(new CustomEvent('map-ready', { bubbles: true }));
		} catch (error) {
			console.error('🗺️ ❌ Failed to load map:', error);
		}
	}

	/**
	 * Load photos and add them to the map
	 * @returns {Promise<void>}
	 */
	async loadPhotos() {
		if (!this.map) return;

		const mockPhotos = [
			{
				user: { name: 'John Doe' },
				urls: { thumb: 'https://example.com/photo1.jpg' },
				alt_description: 'A beautiful landscape',
				links: { html: 'https://unsplash.com/photos/sample1' },
				location: { position: { latitude: 51.505, longitude: -0.09 } },
			},
			{
				user: { name: 'Jane Smith' },
				urls: { thumb: 'https://example.com/photo2.jpg' },
				alt_description: 'City skyline',
				links: { html: 'https://unsplash.com/photos/sample2' },
				location: { position: { latitude: 51.51, longitude: -0.1 } },
			},
			{
				user: { name: 'Alex Johnson' },
				urls: { thumb: 'https://example.com/photo3.jpg' },
				alt_description: 'Mountain view',
				links: { html: 'https://unsplash.com/photos/sample3' },
				location: { position: { latitude: 51.515, longitude: -0.11 } },
			},
		];

		mockPhotos.forEach((photo) => {
			const marker = L.marker(
				[photo.location.position.latitude, photo.location.position.longitude],
				{
					icon: L.divIcon({
						className: 'photo-marker',
						html: '<div class="marker-pin"></div>',
					}),
				},
			);

			marker.bindPopup(`
				<div class="photo-popup">
					<strong class="photo-credit">Photo by ${photo.user.name}</strong><br/>
					<img src="${photo.urls.thumb}" alt="${photo.alt_description || 'Photo'}" style="width:100px;"/><br/>
					<a href="${
						photo.links.html
					}" target="_blank" rel="noopener noreferrer" class="attribution-link">View on Unsplash</a>
				</div>
			`);

			// Only add marker if map exists
			if (this.map) {
				marker.addTo(this.map);
			}
		});
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
					position: relative;
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
				.photo-attribution {
					position: absolute;
					bottom: 10px;
					right: 10px;
					background: rgba(255, 255, 255, 0.9);
					padding: 5px 10px;
					border-radius: 4px;
					font-size: 12px;
					z-index: 1000;
				}
				.photo-marker {
					width: 25px !important;
					height: 25px !important;
					background: var(--color-primary, #007bff);
					border: 2px solid white;
					border-radius: 50%;
					cursor: pointer;
				}
				.photo-popup {
					text-align: center;
					padding: 10px;
				}
				.photo-credit {
					display: block;
					margin-bottom: 5px;
					font-weight: bold;
				}
				.attribution-link {
					display: inline-block;
					margin-top: 5px;
					color: #007bff;
					text-decoration: none;
				}
				.attribution-link:hover {
					text-decoration: underline;
				}
				/* Leaflet Styles */
				.leaflet-pane,
				.leaflet-tile,
				.leaflet-marker-icon,
				.leaflet-marker-shadow,
				.leaflet-tile-container,
				.leaflet-pane > svg,
				.leaflet-pane > canvas,
				.leaflet-zoom-box,
				.leaflet-image-layer,
				.leaflet-layer {
					position: absolute;
					left: 0;
					top: 0;
				}
				.leaflet-container {
					overflow: hidden;
					height: 100%;
				}
				.leaflet-tile,
				.leaflet-marker-icon,
				.leaflet-marker-shadow {
					-webkit-user-select: none;
					-moz-user-select: none;
					user-select: none;
					-webkit-user-drag: none;
				}
				.leaflet-popup-content-wrapper {
					padding: 1px;
					text-align: left;
					border-radius: 12px;
				}
			</style>
			<div id="map" role="application" aria-label="Interactive map showing photos around you"></div>
			<slot></slot>
		`;
	}
}

// www/scripts/map.js
/**
 * Map initialization and related components
 * 🗺️ Handles map functionality and components
 */

import { MapContainer } from '/components/map-container.js';

// Register map components
if (!customElements.get('map-container')) {
	customElements.define('map-container', MapContainer);
	console.info('🗺️ 📝 Map components registered');
}

# Picognito Implementation Plan

This document provides detailed technical guidance for implementing the milestones outlined in the README.md.

## Milestone 1: Basic Map Setup - Implementation Details

### Map Library Integration

```js
// www/components/map-container.js
/**
 * Map container web component that encapsulates Leaflet functionality
 * @class MapContainer
 * @extends HTMLElement
 */
class MapContainer extends HTMLElement {
	/**
	 * Creates an instance of MapContainer
	 * @constructor
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
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
	 * @returns {void}
	 */
	initMap() {
		// Map initialization will go here
		console.info('🗺️ 🚀 Initializing map component');
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
```

### Technical Requirements

1. **ES Module Implementation**

    - Use `<script type="module">` for all JavaScript imports
    - Import Leaflet directly from CDN (no bundling)
    - Example: `import L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js'`

2. **Web Component Structure**

    - Create self-contained web component for map functionality
    - Use Shadow DOM for style encapsulation
    - Provide clear API for other components to interact with

3. **Accessibility Features**

    - Include proper ARIA roles and labels
    - Implement keyboard navigation for map controls
    - Ensure high contrast mode support
    - Add screen reader descriptions for map markers

4. **Responsive Design**
    - Implement fluid layout that works on all screen sizes
    - Optimize controls for touch devices
    - Use CSS variables for theming support

### Test Strategy

1. **Playwright Tests**

    ```js
    // test/map.spec.js
    test('map displays and initializes correctly 🗺️ 🧪', async ({ page }) => {
    	await page.goto('/');

    	// Check map container is visible
    	await expect(page.locator('map-container')).toBeVisible();

    	// Verify Leaflet is initialized
    	await expect(page.locator('.leaflet-container')).toBeVisible();

    	// Test map interactivity
    	await page.mouse.move(200, 200);
    	await page.mouse.down();
    	await page.mouse.move(250, 200);
    	await page.mouse.up();

    	// Verify map moved
    	// Compare screenshot with baseline
    });

    test('map is keyboard accessible 🗺️ ⌨️', async ({ page }) => {
    	await page.goto('/');

    	// Tab to map controls
    	await page.keyboard.press('Tab');
    	await page.keyboard.press('Tab');

    	// Verify focus is visible
    	const focused = await page.evaluate(() => {
    		return document.activeElement.classList.contains('leaflet-control');
    	});

    	expect(focused).toBeTruthy();
    });
    ```

2. **Visual Testing**
    - Create baseline screenshots for map component
    - Test under different viewport sizes
    - Compare visual snapshots after implementation

## Implementation Steps

1. **Create Basic Project Structure**

    ```
    www/
      components/
        map-container.js
      scripts/
        map-init.js
      styles/
        map.css
    ```

2. **Add Leaflet Dependencies**

    - Add ESM imports for Leaflet
    - Include necessary CSS

3. **Create Map Component**

    - Implement web component with Shadow DOM
    - Add lifecycle methods and core functionality

4. **Build Responsive Layout**

    - Create responsive CSS for map container
    - Implement adaptive controls based on viewport

5. **Add Accessibility Features**

    - Implement keyboard navigation
    - Add proper ARIA attributes
    - Test with screen readers

6. **Write Tests**

    - Create Playwright tests for map functionality
    - Implement visual regression tests

7. **Documentation**
    - Add JSDoc comments to all functions
    - Create usage examples for the map component

## Coding Guidelines

-   Follow all principles from copilot-instructions.md:
    -   Use clean, direct JavaScript (no TypeScript)
    -   Implement self-documenting code with clear naming
    -   Follow bottom-line-up-front logic pattern
    -   Apply DRY principles only when code repeats twice or more
    -   Create focused components with single responsibilities
    -   Use web components for DOM interaction
    -   Ensure all code is covered by Playwright tests

## Resources

-   [Leaflet Documentation](https://leafletjs.com/reference.html)
-   [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
-   [WCAG Map Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/map/)

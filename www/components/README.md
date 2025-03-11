# Web Components Documentation

This directory contains the project's web components, each designed to be modular and reusable.

## 🧩 Component Philosophy

Picognito uses custom web components for encapsulated, reusable UI elements. This approach provides:

- **Encapsulation**: Self-contained components with their own styling and behavior
- **Reusability**: Components can be used across multiple pages
- **Maintainability**: Changes to components are isolated from the rest of the application
- **Progressive Enhancement**: Core functionality works without JavaScript

## 📋 Available Components

### `<theme-toggle>`

A toggle switch component for controlling light, dark, and system themes:

```html
<theme-toggle></theme-toggle>
```

#### Features:

- **Multiple theme modes:** Supports light, dark, and system preference modes
- **Preference persistence:** Remembers user's theme choice across sessions
- **System preference detection:** Automatically follows system theme when in auto mode
- **Self-contained styles:** All styles are encapsulated within the component
- **Responsive design:** Adapts to different screen sizes

#### JavaScript API:

```javascript
// Import the component class if you want to use it programmatically
import { ThemeToggle } from './components/theme-toggle.js';

// Or use the already registered custom element
const toggle = document.querySelector('theme-toggle');

// Get the current theme
const currentTheme = toggle.getTheme();

// Check if dark mode is active
const isDark = toggle.isDarkMode();

// Set theme programmatically
toggle.setTheme('dark'); // Options: 'light', 'dark', 'system'

// Listen for theme changes
toggle.addEventListener('themeChange', (e) => {
	console.log('Theme changed:', e.detail.theme);
	console.log('Is dark mode:', e.detail.isDark);
});
```

#### Implementation Details:

- **Component Structure**:
  - Uses Shadow DOM for style encapsulation
  - Maintains internal state with private class fields
  - Provides proper accessibility attributes (ARIA)
  - Implements proper event listeners and cleanup

- **Theme Management**:
  - Stores preference in localStorage
  - Detects system preference using media queries
  - Updates in real-time when system preference changes

### `<map-container>`

Displays an interactive map with photos and location data.

#### Features:
- Leaflet map integration
- Accessible controls with keyboard navigation
- Loading indicators and error handling
- Responsive design for different viewport sizes
- Events for map interaction

### `<image-carousel>`

Displays a carousel of images with navigation controls.

#### Features:
- Auto-play capability
- Custom interval setting
- Accessible navigation
- Touch support for mobile devices

## 🛠️ Creating New Components

### Component File Structure

Each component should have:
1. **JavaScript file**: Contains the component class definition
2. **CSS file**: Contains component-specific styles

Example:
```
www/components/
  └── my-component.js    # Component JavaScript
  └── my-component.css   # Component CSS
```

### Component Template

```js
// filepath: www/components/my-component.js

/**
 * @element my-component
 * @description Brief description of component functionality
 * @attr {string} attribute-name - Description of attribute
 * @fires event-name - Description of event
 */
export class MyComponent extends HTMLElement {
	/**
	 * Create a new MyComponent instance
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * Called when component is connected to the DOM
	 */
	connectedCallback() {
		this.render();
		this.setupEventListeners();
	}

	/**
	 * Called when component is disconnected from the DOM
	 */
	disconnectedCallback() {
		this.removeEventListeners();
	}

	/**
	 * Observe attribute changes
	 * @returns {string[]} Array of attributes to observe
	 */
	static get observedAttributes() {
		return ['attribute-name'];
	}

	/**
	 * Handle attribute changes
	 * @param {string} name - Name of changed attribute
	 * @param {string} oldValue - Previous value
	 * @param {string} newValue - New value
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	/**
	 * Render the component
	 */
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				@import "/components/my-component.css";
			</style>
			<div class="my-component">
				<!-- Component content -->
			</div>
		`;
	}

	/**
	 * Set up event listeners
	 */
	setupEventListeners() {
		// Add event listeners
		console.log('🧩 🔄', 'My component initialized');
	}

	/**
	 * Remove event listeners
	 */
	removeEventListeners() {
		// Remove event listeners
	}
}

// Don't register the component here; register it in the page script instead
```

### Component Registration

Register components in page scripts:

```js
import { MyComponent } from '/components/my-component.js';

if (!customElements.get('my-component')) {
	customElements.define('my-component', MyComponent);
}
```

## 📊 Component Best Practices

- **Accessibility**: Ensure components are keyboard navigable and screen-reader friendly
- **Progressive Enhancement**: Components should degrade gracefully when JavaScript is disabled
- **Event Handling**: Clean up event listeners in disconnectedCallback to prevent memory leaks
- **Custom Events**: Use custom events for component communication
- **Attributes**: Use attributes for configuration, not for dynamic data
- **Performance**: Keep DOM operations to a minimum and use efficient rendering techniques
- **Naming**: Use kebab-case for component names and follow consistent naming patterns

## 🔄 Component Communication

Components should communicate using custom events:

```js
// Dispatching an event from a component
this.dispatchEvent(new CustomEvent('my-event', {
	bubbles: true,
	composed: true,
	detail: { /* event data */ }
}));

// Listening for an event from a component
document.querySelector('my-component')
	.addEventListener('my-event', (e) => {
		console.log('🧩 📣', 'Event received', e.detail);
	});
```

See [ARCHITECTURE.md](../ARCHITECTURE.md) for overall project structure and [STYLE_GUIDE.md](../STYLE_GUIDE.md) for coding standards.

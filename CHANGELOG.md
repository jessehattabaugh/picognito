# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Detailed implementation plan for Picognito photo-sharing app
- Map setup technical specifications and component architecture
- Documentation for Milestone 1 implementation in IMPLEMENTATION.md
- Enhanced development roadmap with detailed steps for all milestones
- Web component structure for map container
- Map visibility and initialization improvements
- Map component readiness state indicators
- Map section styling for consistent layout
- Leaflet map integration with ES modules
- Accessible map controls with keyboard navigation support
- Map loading indicators and error handling
- End-to-end tests for map functionality
- Responsive design for map on different viewport sizes

### Fixed

- Map component visibility in tests
- Map initialization detection
- Keyboard navigation focus management
- Added proper ES module import for Leaflet library
- Improved JSDoc type definitions in utility functions
- Fixed console logging patterns to follow project guidelines
- Added safety checks for DOM manipulation and event handlers
- Fixed undefined variable references in test utilities
- Enhanced error handling for asynchronous operations

### In Progress

- Contact form handling with Netlify Functions
- End-to-end tests for contact form functionality
- Form validation and error handling
- Success/error message display for form submissions
- Map markers for displaying photo locations

## [1.1.0] - 2024-01-17

### Added

-   Netlify support with netlify-cli for development
-   Automated screenshot management for PWA manifest
-   Build script to prepare screenshots for deployment
-   Screenshot acceptance workflow with .tmp naming convention

### Changed

-   Moved test utilities to /bin directory
-   Development server now uses Netlify Dev instead of serve
-   Updated documentation for screenshot and deployment workflows

## [1.0.0] - 2023-08-01

### Added

-   Initial project setup
-   Theme toggle component with light/dark/system mode support
-   Responsive design with mobile-first approach
-   Service worker for offline support
-   Basic HTML pages: index, about, contact, offline
-   CSS structure with modular stylesheets
-   Playwright testing setup
-   ESLint configuration
-   Documentation in README.md

### Changed

-   N/A (initial release)

### Fixed

-   N/A (initial release)

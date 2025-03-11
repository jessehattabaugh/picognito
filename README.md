# Picognito - Anonymously Share Your World

**Picognito** is an anonymous, location-based photo-sharing Progressive Web App (PWA). It allows users to share and explore nearby visual moments safely without compromising their identity or privacy.

## Core Philosophy

- **Total Anonymity**: No accounts, no names, no identifiable information.
- **Safe Sharing**: Automatic moderation using AI and community moderation to prevent personal or sensitive content.
- **Local Discovery**: Explore local or global anonymous photos through intuitive filtering.

## Tech Stack
- HTML/CSS/JavaScript
- Leaflet (Map)
- Netlify Functions & Database
- Playwright (Testing)
- PWA (Offline Capability)

## Development Milestones & Steps

### ✅ Milestone 1: Basic Map Setup
- [x] Install and integrate Leaflet library (no package bundlers, direct ES module import)
- [x] Initialize Leaflet map fullscreen with accessible controls
- [x] Create map-container web component for encapsulated functionality
- [x] Add responsive design for different viewport sizes
- [x] Write E2E Playwright tests to verify map displays and functions correctly
- [ ] [Optional] Populate map initially with photos from public APIs (e.g., Unsplash, OpenStreetMap)

### 🗺️ Milestone 2: User Location Integration
- [ ] Create geo-location web component to handle location services
  - Note: Refining geo-location integration details (UX, permission prompts, & fallback scenarios).
- [ ] Implement permission request UX with clear messaging about privacy
- [ ] Add custom location marker for user's position on map
- [ ] Build graceful fallback for geolocation permission denial
- [ ] Implement location accuracy indicator
- [ ] Add location refresh functionality with appropriate UI indicators
- [ ] Write Playwright tests for geolocation scenarios (including permission denial)

### 📱 Milestone 3: Offline PWA Functionality
- [ ] Configure service worker for offline access with proper caching strategies
- [ ] Implement manifest.json with appropriate PWA metadata
- [ ] Create offline.html with clear messaging and functionality
- [ ] Add install prompts with deferrable UI
- [ ] Implement background sync for offline data
- [ ] Create IndexedDB storage schema for offline photos
- [ ] Add clear visual indicators for online/offline state
- [ ] Test PWA functionality on multiple devices and browsers

### 📸 Milestone 4: Photo Capture and Local Storage
- [ ] Create camera-interface web component with accessibility features
- [ ] Implement secure local storage for captured photos using IndexedDB
- [ ] Add photo preview functionality with simple editing tools
- [ ] Build privacy slider to control metadata and blurring level
- [ ] Create gallery view for locally stored photos
- [ ] Implement EXIF data stripping client-side
- [ ] Add photo location linking with map markers
- [ ] Build comprehensive E2E tests for photo capture workflow

### 🔄 Milestone 5: Automatic Photo Upload
- [ ] Create upload-queue web component to manage background uploads
- [ ] Implement compression algorithm for efficient data transfer
- [ ] Build privacy-preserving blur filters based on user settings
- [ ] Develop metadata removal process for all uploaded images
- [ ] Add upload progress indicators with accessibility support
- [ ] Implement retry mechanisms for failed uploads
- [ ] Create Netlify function for secure photo storage
- [ ] Test upload functionality under various network conditions

### 🔗 Milestone 6: Control URLs & Management
- [ ] Design secure hash generation for anonymous control URLs
- [ ] Create control-panel web component for photo management
- [ ] Implement local encrypted storage for control URLs
- [ ] Build photo deletion functionality via control URLs
- [ ] Add expiration options for shared photos
- [ ] Create QR code generator for easy sharing of control URLs
- [ ] Test security measures with penetration testing scenarios

### 🔍 Milestone 7: Browsing Anonymous Photos
- [ ] Create map-marker web component for photo display
- [ ] Implement clustering for dense photo areas
- [ ] Build photo detail view with privacy-preserving zoom
- [ ] Add distance-based and time-based filtering options
- [ ] Implement smooth transitions between map and detail views
- [ ] Create photo information panel with non-identifying metadata
- [ ] Add keyboard navigation and screen reader support for browsing
- [ ] Test browsing experience on various devices and connection speeds

### 👮 Milestone 8: Crowd Moderation & AI Moderation
- [ ] Create moderation-panel web component for user interactions
- [ ] Implement like/not interested functionality with visual indicators
- [ ] Build Netlify function for AI moderation integration
- [ ] Create moderation queue for flagged content
- [ ] Implement automatic removal threshold for negative feedback
- [ ] Add clear feedback for users when content is moderated
- [ ] Test moderation system with various content scenarios

### 🔐 Milestone 9: Robust Security & Privacy Measures
- [ ] Conduct thorough security audit of all data flows
- [ ] Implement additional client-side privacy protections
- [ ] Create regular data cleanup processes for stale content
- [ ] Add comprehensive privacy documentation for users
- [ ] Build abuse prevention mechanisms
- [ ] Implement rate limiting for API endpoints
- [ ] Test security measures with ethical hacking techniques
- [ ] Create privacy compliance documentation (GDPR, CCPA)

### ⚡ Milestone 10: Scalability & Optimization
- [ ] Optimize asset loading with responsive images and lazy loading
- [ ] Implement database sharding for geographical data
- [ ] Create edge-optimized delivery for photo content
- [ ] Add performance monitoring and real-time analytics
- [ ] Implement CDN caching strategies
- [ ] Build load testing scenarios and benchmarks
- [ ] Optimize JavaScript bundle size and execution
- [ ] Create comprehensive performance test suite

## Continuous Testing & Deployment
- [ ] Set up Netlify CI/CD pipeline with test integration
- [ ] Create visual regression tests with Playwright
- [ ] Implement accessibility testing in CI pipeline
- [ ] Add performance testing thresholds for deployment approval
- [ ] Build automated security scanning
- [ ] Implement versioned deployments with rollback capability
- [ ] Create comprehensive test documentation
- [ ] Add test coverage reporting

## Public API Integration for Initial Content
- [ ] Research and select appropriate free public APIs
- [ ] Create data transformer utilities for API responses
- [ ] Implement rate limiting and caching for API requests
- [ ] Add attribution for third-party content
- [ ] Build fallback content for offline or API failure scenarios
- [ ] Document API dependencies and alternatives


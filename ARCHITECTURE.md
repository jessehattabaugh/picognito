# Picognito Architecture

## 📝 Project Overview

**Picognito** is an anonymous, location-based photo-sharing Progressive Web App (PWA). It allows users to share and explore nearby visual moments safely without compromising their identity or privacy.

### 🧠 Core Philosophy

- **Total Anonymity**: No accounts, no names, no identifiable information
- **Safe Sharing**: Automatic moderation using AI and community moderation to prevent sensitive content
- **Local Discovery**: Explore local or global anonymous photos through intuitive filtering

## 📐 Project Structure

```
picognito/
├── bin/           # Build and utility scripts
├── netlify/       # Netlify integration
│   └── functions/ # Serverless functions
├── snapshots/     # Screenshots taken during tests
├── test/          # End-to-end tests
│   └── utils/     # Test utilities
└── www/           # Static web assets (published directory)
    ├── components/ # Web components
    ├── scripts/    # Page scripts
    └── styles/     # CSS files
```

## 🛠️ Tech Stack

- **Frontend**: HTML/CSS/JavaScript with Web Components architecture
- **Mapping**: Leaflet for interactive maps and location features
- **Backend**: Netlify Functions & Database for serverless operations
- **Testing**: Playwright for end-to-end and visual regression testing
- **PWA**: Service workers and manifests for offline capabilities

## 🏗️ Technical Architecture

### Key Principles

- **No Build System**: Direct ES module imports without bundlers
- **Web Components**: Custom elements for encapsulated functionality
- **Progressive Enhancement**: Core functionality works without JS
- **Offline-First**: Service worker with strategic caching
- **Accessibility**: WCAG AA compliance as minimum standard

### Technical Choices

#### Frontend Stack
- **HTML/CSS/JavaScript**: Vanilla web standards with no frameworks
- **Web Components**: Custom Elements API for component architecture
- **Leaflet**: Lightweight mapping library with good accessibility
- **IndexedDB**: Client-side storage for offline photo data

#### Backend Stack
- **Netlify Functions**: Serverless for all API endpoints
- **Netlify Forms**: For contact form submissions
- **Netlify Identity**: For optional admin functionality
- **Netlify Database**: Storage for shared photos

## 🛣️ Data Flow Architecture

1. **Photo Capture**: Client-side camera access using web APIs
2. **Local Processing**:
   - Privacy filtering (blur sensitive areas)
   - Metadata stripping (EXIF removal)
   - Local storage in IndexedDB
3. **Upload Queue**:
   - Background sync when online
   - Retry mechanism for failures
4. **Server Processing**:
   - AI moderation checks
   - Storage in Netlify Database
   - Generation of anonymous control URLs
5. **Photo Discovery**:
   - Geospatial queries based on location
   - Map display with clustered markers
   - Privacy-preserving zoom functionality

## 📄 Documentation Index

- [README.md](README.md) - Project overview and getting started
- [ROADMAP.md](ROADMAP.md) - Implementation timeline and milestones
- [STYLE_GUIDE.md](STYLE_GUIDE.md) - Development principles and coding standards
- [TESTING.md](TESTING.md) - Testing practices and guidelines
- [CHANGELOG.md](CHANGELOG.md) - History of changes and feature additions
- [www/components/README.md](www/components/README.md) - Web components documentation
- [netlify/functions/README.md](netlify/functions/README.md) - Netlify functions documentation

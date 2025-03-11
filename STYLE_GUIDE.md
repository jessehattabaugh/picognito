# Picognito Style Guide

## 🧭 Core Development Principles

-   **Keep it Simple:** Prioritize readability, clarity, and directness over clever or complex implementations
-   **Modern JavaScript:** Use JavaScript with JSDoc type annotations (no TypeScript), employing ES Modules and modern ES6+ features
-   **Self-Documenting Code:** Choose meaningful names and clear structures to communicate intent
-   **Bottom-Line-Up-Front Logic:** Implement core logic first, handling primary cases upfront. Avoid deeply nested structures
-   **Don't Repeat Yourself Twice (DRYT):** Abstract repeated logic into shared functions only after encountering it twice
-   **You Aren't Gonna Need It (YAGNI):** Avoid coding for hypothetical future requirements
-   **Single Responsibility Principle:** Write focused, concise functions and modules that perform one task clearly

## 🧩 Project Standards

-   **Test-Driven Development:** Write failing end-to-end tests first, then the minimal code needed to pass
-   **Documentation:** Log all significant changes in `CHANGELOG.md`
-   **Component Architecture:** Web components are required for DOM interactions
-   **Programming Paradigms:** Prefer functional programming for data transformations and OOP for complex control flows
-   **Test Coverage:** Ensure comprehensive end-to-end testing of user-facing pages with Playwright
-   **Directory Structure:** Structure codebases in long, flat directories rather than deeply nested ones

## 📝 Coding Guidelines

### Code Formatting

-   **Indentation:** Use tabs for indentation
-   **Line Length:** Keep lines under 100 characters where practical
-   **Whitespace:** Use consistent spacing around operators and after commas

### JavaScript Practices

-   **Typing:** Always provide JSDoc type annotations
-   **Modules:** Use ES modules exclusively with named exports/imports, break large modules into smaller reusable modules loaded natively
-   **Async/Await:** Use async/await syntax with Fetch API for cleaner asynchronous code
-   **Features:** Employ modern JavaScript features (destructuring, template literals, arrow functions)
-   **Function Creation:** Only create new functions for code reuse:
    -   Functions must have at least two call sites or be passed as callbacks
    -   Avoid unnecessary abstraction or creating functions solely for organizing code
-   **Browser Compatibility:** Support all modern browsers; no Internet Explorer compatibility

### Logging

-   **Console Messages:** Use exactly two emojis per console message:
    -   First emoji: Shared per file for quick file identification
    -   Second emoji: Unique per message for message type identification
-   **Logging Levels:**
    -   `console.debug()`: Minor information, loop iterations, internal details
    -   `console.info()`: Useful but non-critical messages
    -   `console.log()`: General information useful to end-users
    -   `console.warn()`: Important notices or potential issues users must see
    -   `console.error()`: Only for unrecoverable errors; include debugging information

### File System and Tools

-   **Cross-Platform:** Avoid Windows-specific tools like `rimraf`, `cross-env`, or `mkdirp`
-   **Control Flow:** Prefer traditional control structures (`if/else`, `switch`, `while`) for clarity

## 🎨 HTML & CSS Guidelines

-   **Web Components:** Utilize Custom Elements and Semantic HTML5 for proper document structure
-   **Lean Markup:** Write minimal HTML with few wrapper elements
-   **Modern CSS Techniques:** Make pages responsive by using modern `@container` queries, Prefer Grid and Flexbox for layours. Avoid floats and clearfix hacks
-   **Manage Specificity:** Organize styles in logical groups using `@layer`, encapsulate CSS in shadow DOM, and use simple, shallow selectors; avoid overly nested rules
-   **Mobile-First:** Prioritize mobile-first design and
-   **Accessibility:** Adhere strictly to WCAG AA guidelines minimum; ensure keyboard navigation
-   **Performance:** Optimize for excellent Core Web Vitals scores

## 🧪 Testing Principles

We follow a user-focused, end-to-end testing approach. For comprehensive testing guidelines, practices, and examples, refer to [TESTING.md](TESTING.md).

See [TESTING.md](TESTING.md) for detailed testing practices and [ARCHITECTURE.md](ARCHITECTURE.md) for project structure.

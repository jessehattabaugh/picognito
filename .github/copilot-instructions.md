# copilot-instructions.md

## Technical Coding Guidelines

- **Indentation:** Use tabs for indentation.
- **Typing:** Always provide JSDoc type annotations.
- **Testing:** Every new functionality or bug fix must begin with a failing end-to-end test that exercises actual web pages.
  - Only create tests that interact with real HTML pages through the user interface.
  - Do not create mock objects, unit tests, or test fixtures.
  - Test files should correspond to actual pages in the `/www` directory.
  - Focus tests on what real users would see and interact with.
- **Console Logging:**
  - Emoji usage is encouraged for clarity and quick visual identification.
  - Use exactly two emojis per console message: one shared per file, one unique per message.
  - Console methods:
    - `console.debug()`: Minor information, loop iterations, internal details.
    - `console.info()`: Useful but non-critical messages.
    - `console.log()`: General information useful to end-users.
    - `console.warn()`: Important notices or potential issues users must see.
    - `console.error()`: Only for unrecoverable errors; always include relevant debugging information.

- **Function Creation:** Only create new functions for code reuse:
  - Functions must have at least two call sites or be passed as callbacks.
  - Avoid unnecessary abstraction or creating functions solely for organizing code.

- **Browser Compatibility:** Support all modern browsers; no Internet Explorer compatibility.
- **File System and Tools:**
  - Avoid Windows-specific tools like `rimraf`, `cross-env`, or `mkdirp`.
  - Prefer traditional control structures (`if/else`, `switch`, `while`) for clarity.

- **CSS Guidelines:**
  - Use simple, shallow selectors.
  - Avoid overly nested CSS rules.

- **JavaScript Modules:** Use ES modules exclusively, and employ modern JavaScript features such as destructuring and template literals for clarity.


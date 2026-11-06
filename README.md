# ToDo List Vanilla

A lightweight task-list application built with **Vanilla JavaScript**, without a UI framework or backend. Developed as a frontend technical assessment using the supplied [Adobe XD design](https://xd.adobe.com/view/ea696dd0-8781-4460-8720-36deb2d19b2a-bf3a/).

**Live demo:** [ToDo List Vanilla on GitHub Pages](https://elias-km.github.io/todo-vanilla/)

## Features

- Add tasks through an animated dialog; empty entries are rejected.
- Select one or multiple tasks and delete them together, or double-click an item to delete it.
- Undo and redo changes with an in-memory history.
- Save tasks automatically in `localStorage`.
- Load three sample tasks on first use; they do not reappear if the list is later emptied.
- Share the current list via the native share menu when available, with clipboard fallback.
- Responsive UI with native HTML controls and keyboard-accessible interactions.

> Tasks are stored only in the current browser and origin, not synchronized across devices. Selection and undo/redo history are reset when the page reloads.

## Tech stack

- **JavaScript (ES Modules)** and native DOM APIs
- **Vite** for development and builds
- **HTML templates** imported with `?raw`, **CSS Modules** and global CSS
- **Vitest + jsdom** for unit and integration tests
- **Playwright** for optional, manually run E2E tests
- **GitHub Actions + GitHub Pages** for CI/CD and hosting

## Getting started

**Requirements:** Node.js 24 and npm (matching the CI environment).

```bash
npm ci
npm run dev
```

Open the local address printed by Vite.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run test` | Run unit and integration tests with Vitest |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Generate the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run e2e` | Manually run Playwright E2E tests in visible Chromium |

To run the E2E tests for the first time, install Chromium:

```bash
npx playwright install chromium
npm run e2e
```

Playwright starts the local Vite server if needed and opens a visible browser with slowed-down interactions. **E2E tests are not run by `npm run test` or by CI/CD.**

## Project structure

```text
.github/workflows/
└── ci.yml                    # Test, build and deploy workflow
src/
├── components/
│   ├── TodoForm/             # Add-task dialog: HTML, JS and CSS Module
│   ├── TodoItem/             # Task display, selection and double-click
│   └── TodoList/             # Task list rendering
├── shareTodos/               # Share/copy behavior and unit tests
├── todoStore/                # State, selection, undo/redo and unit tests
├── todoStorage/              # localStorage validation and unit tests
├── app.js                    # Wire UI, store and persistence
├── bootstrap.js              # Load saved tasks or initial examples
├── global.css                # Shared styles and design tokens
└── main.js                   # Entry point
tests/
├── integration/app.test.js   # Cross-module application flows
└── e2e/todo.e2e.js           # Browser-level flows (manual)
index.html                    # Main page markup
playwright.config.js          # Visible Chromium E2E configuration
vite.config.js                # Base path for GitHub Pages
package.json                  # Dependencies and npm scripts
```

The project follows **colocation**: each component or functional module keeps its related implementation, styles and unit tests together. Cross-module integration and E2E tests are separated under `tests/`.

### Architecture in brief

1. `bootstrap.js` loads saved tasks, or seeds three sample tasks only on first use.
2. `app.js` connects the native-DOM components to a framework-free store.
3. Store updates notify the UI; task changes are persisted through `todoStorage`.
4. Undo and redo use in-memory snapshots. A new task change clears the redo history.

## Testing and CI/CD

The unit tests cover the store, storage and share formatting; integration tests cover the main application flows. Playwright E2E tests exercise Chromium separately and **only on manual request**.

The [GitHub Actions workflow](.github/workflows/ci.yml) runs on pushes to `main` and pull requests targeting `main`:

1. Install dependencies with `npm ci` (Node.js 24).
2. Run unit and integration tests with `npm run test`.
3. Validate the production build with `npm run build`.
4. **On pushes to `main` only**, deploy the built `dist/` artifact to GitHub Pages after validation succeeds.

Pull requests are validated but are **not deployed**.

## Deployment

The site is deployed through GitHub Actions to **GitHub Pages**:

**[https://elias-km.github.io/todo-vanilla/](https://elias-km.github.io/todo-vanilla/)**

Vite uses `base: '/todo-vanilla/'` to resolve assets correctly under the repository's Pages path. Subsequent pushes to `main` trigger automatic validation and deployment; no manual build or hosting service is required.

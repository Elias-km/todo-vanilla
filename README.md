# ToDo List Vanilla

A lightweight task list built with **Vanilla JavaScript**, with no UI framework or backend. Created as a frontend technical assessment, following the supplied [Adobe XD reference](https://xd.adobe.com/view/ea696dd0-8781-4460-8720-36deb2d19b2a-bf3a/).

## Features

- Add tasks, with validation to prevent empty entries.
- Select one or multiple tasks and delete them together.
- Delete a task by double-clicking it.
- Undo and redo changes using an in-memory history.
- Save tasks automatically in `localStorage`.
- Load three example tasks on first use, without restoring them after the list is cleared.
- Share the current list using the native share menu when available, or copy it to the clipboard.
- Responsive interface, keyboard-accessible controls and an animated add-task dialog.

> Data is stored only in the current browser and origin. It is not synchronized across devices. Selection and undo/redo history are not persisted across page reloads.

## Tech stack

- JavaScript (ES Modules) and native DOM APIs
- Vite
- HTML templates imported with `?raw`
- CSS Modules and a global stylesheet
- Vitest and jsdom for tests
- GitHub Actions for continuous integration

## Getting started

**Requirements:** Node.js 24 and npm (the same Node.js major version used by CI).

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/`).

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run test` | Run unit and integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Build the application into `dist/` |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
.github/workflows/
└── ci.yml                    # Tests and build on pushes and pull requests
src/
├── components/
│   ├── TodoForm/             # Add-task dialog: HTML, JavaScript, CSS Module
│   ├── TodoItem/             # Individual task and selection interactions
│   └── TodoList/             # Task list rendering
├── shareTodos/
│   ├── shareTodos.js         # Share/copy and plain-text formatting
│   └── shareTodos.test.js
├── todoStore/
│   ├── todoStore.js          # State, selection and undo/redo history
│   └── todoStore.test.js
├── todoStorage/
│   ├── todoStorage.js        # localStorage access and data validation
│   └── todoStorage.test.js
├── app.js                    # Connect components, state and persistence
├── bootstrap.js              # Load saved tasks or initial examples
├── global.css                # Shared styles and design tokens
└── main.js                   # Application entry point
tests/integration/
└── app.test.js               # Main user flows
index.html                    # Page layout and mount point
package.json                  # Scripts and development dependencies
```

Each visual component keeps its `.html`, `.js` and `.module.css` files together. Unit tests live alongside their modules (**colocation**); cross-module integration tests live in `tests/integration/`.

### How it works

1. `bootstrap.js` loads saved tasks, or creates the three examples on first use.
2. `app.js` wires the UI to the framework-free store.
3. The store handles changes and notifies the UI; task changes are persisted through `todoStorage`.
4. Undo and redo keep previous and future snapshots in memory. A new task change clears the redo history.

## Testing and CI

Unit tests cover the store, storage and share formatting. Integration tests cover the main application flows.

The GitHub Actions workflow at `.github/workflows/ci.yml` runs on pushes to `main` and pull requests targeting `main`. It installs dependencies with `npm ci`, runs tests and checks the production build.

### End-to-end testing

Playwright provides optional E2E tests using a real Chromium browser.

```bash
npx playwright install chromium
npm run e2e
```

E2E tests run **manually only**, in headed mode with slowed-down browser interactions for demonstration purposes.

They are intentionally excluded from the Vitest test suite and CI/CD pipeline.

## Deployment

**GitHub Pages deployment is planned, but not yet configured.** The intended demo URL is:

`https://elias-km.github.io/todo-vanilla/`

Before publishing, configure Vite's `base` for `/todo-vanilla/`, add a deployment workflow and enable GitHub Pages with **GitHub Actions** as its source.

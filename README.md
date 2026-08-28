# Angel Colberg Portfolio

AngularJS 1.x portfolio site with a legacy theme layer, responsive layouts, animations, and project views. The application is a static single-page site: Gulp builds the assets, and BrowserSync serves the files during development.

## Architecture

The site has two cooperating runtime layers:

1. **AngularJS application layer**
	- [app/app.js](app/app.js) defines the `portfolio-app` module and HTML5 routes.
	- `app/` contains controllers, configuration, factories, and portfolio data.
	- `components/` contains Angular directives and services.
	- `views/` contains route templates for the home, work, and contact pages.

2. **Non-Angular theme layer**
	- [js/nonangular/main.js](js/nonangular/main.js) owns global theme behavior such as menus, sticky elements, sliders, portfolio layout, lightboxes, transitions, and responsive updates.
	- Vendor libraries in `js/nonangular/` and selected packages in `node_modules/` support animation, layout, media, and interaction features.
	- The theme layer is DOM-safe: it checks optional elements before operating on them and uses `window.__angelPortfolioReady` and `window.__angelPortfolioLoaded` to prevent duplicate ready/load initialization.

Angular controls routing and view composition; the theme layer enhances the DOM after Angular renders it. Keep those responsibilities separate when adding features.

## Directory Layout

```text
/
├── app/                 # AngularJS module, routes, controllers, services, and data
├── components/          # Angular directives, services, and templates
├── views/               # Angular route templates and project pages
├── js/angular/          # Angular-related local scripts
├── js/nonangular/       # Theme runtime and vendor libraries
├── styles/              # SCSS entrypoint, CSS, and static vendor styles
├── images/              # Portfolio images, video, logos, and PDFs
├── assets/              # Fonts, prototypes, and other static assets
├── gulpfile.js          # Development server and production build tasks
├── index.html           # Application shell and asset entrypoints
└── _build/              # Generated production output; do not edit manually
```

## Runtime Startup

`index.html` loads the non-Angular libraries and theme runtime, then AngularJS and the application files. The theme runtime registers:

- A guarded `DOMContentLoaded` path for initial DOM setup.
- A guarded `load` path for dimensions, grids, media, and deferred theme work.
- Debounced resize handling for responsive recalculation.

Optional integrations are checked before use, so pages without a slider, portfolio grid, header, footer, or modal do not fail during startup. This is important because Angular route changes can produce different DOM surfaces inside the shared `#wrapper` element.

## Styling and Build Pipeline

- `styles/style.scss` is compiled to `styles/style.css` during development.
- Static CSS is copied and minified into `_build/styles/static/` for production.
- JavaScript from `app/`, `components/`, and `js/` is minified into `_build/`.
- Angular component templates are compiled into a template cache.
- Route views, images, fonts, and other assets are copied into `_build/`.
- `gulp-usemin` processes the build blocks in `index.html`.
- `stylelint` validates and fixes non-minified CSS and SCSS files.

The production build begins by removing `_build/`, so generated output should never be used as the source of a code change.

## Development

Install dependencies, then start the development server:

```bash
npm install
npm start
```

BrowserSync serves the project from the repository root at `http://localhost:3000`. Its UI is normally available at `http://localhost:3001`. The server watches HTML, templates, JavaScript, and SCSS changes and reloads or recompiles the relevant output.

Create a production build with:

```bash
npm run build
```

Run CSS linting with:

```bash
npm run lint:css
```

## Dependencies

The runtime uses AngularJS, `angular-route`, and `angular-animate`, with libraries for animation, layout, sliders, media, icons, and utility functions. Gulp 4 provides development and production tasks, including BrowserSync, Dart Sass, PostCSS/CSSNano, Uglify, Imagemin, Angular template caching, HTML processing, and Usemin.

This is an AngularJS application, not an Angular 2+ project. Angular CLI, webpack, and other unrelated build systems are not part of the current architecture.

## Verification

The current startup path has been checked in the running site after the initialization changes:

- Page title loads as `Angel Colberg`.
- Browser console and page errors are empty on initial load.
- `npm run build` is the production build command; it may report existing vendor-CSS lint warnings during processing.

The project remains a legacy AngularJS codebase. Future cleanup should preserve the single startup path and continue testing route transitions and page-specific theme behavior before removing older vendor scripts.

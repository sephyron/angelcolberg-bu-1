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

The Angular main controller is intentionally small: [app/main.controller.js](app/main.controller.js) owns route state and the home-page Sine Waves canvas only. It no longer duplicates the legacy theme runtime or uses jQuery. jQuery remains available only for legacy theme plugins that have not yet been migrated.

Angular controls routing and view composition; the theme layer enhances the DOM after Angular renders it. Keep those responsibilities separate when adding features.

## Recent Updates

- Registered `WorkController` and `ContactController` in [index.html](index.html), restoring the `/work` and `/contact` routes.
- Removed unused `jQuery.noConflict()` calls from the Work and Contact controllers.
- Replaced the duplicate jQuery-heavy `MainController` theme implementation with a focused controller using native browser APIs for viewport sizing, styles, and the Sine Waves gradient.
- Kept jQuery available for the legacy theme runtime and plugins in `js/nonangular/main.js` and `js/nonangular/plugins.js`; its removal is a planned, incremental migration rather than a completed change.
- Replaced the incorrect link icon on every portfolio Date row with the existing `icon-line2-calendar` icon.
- Replaced portfolio carousels with stacked images and smooth project transitions.
- Added a shared portfolio image mosaic and click-to-expand viewer for project images above each Use Case section.
- Added Oracle and Lightstep portfolio entries with dedicated logos, image galleries, dates, and case-study content.
- Reworked the portfolio grid into a stable, flat tile list with unique IDs and verified AJAX loaders. Current display order is ServiceNow, Splunk, Lightstep, Tenable, Gigamon, Unity, The Coral Project, Vevo, CloudOn, Oracle, Fantasy Interactive, One Microsoft, Next Generation Intranet, and MSW Redesign.
- Updated project metadata and case-study content for Tenable, Lightstep, Oracle, Gigamon, Unity, and the other portfolio entries as supporting images became available.
- Added guarded theme startup and DOM existence checks to prevent duplicate initialization and route-specific startup errors.

The controller scripts referenced by `index.html` must remain synchronized with the routes in [app/app.js](app/app.js). Adding a route requires loading its controller before Angular bootstraps.

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

## Portfolio Galleries

Project detail templates in `views/projects/inline-*.html` keep their image figures before the first `.use-case` section. The shared `lightbox()` initializer in [js/nonangular/main.js](js/nonangular/main.js) collects those figures after AJAX content loads and moves them into a bounded `.portfolio-image-mosaic` grid.

- Edit the project source templates under `views/projects/`; do not edit generated files under `_build/`.
- Add images as `figure.portfolio-single-image` elements before the first `.use-case` section to include them in the mosaic.
- Each image becomes a native anchor with a real image URL. The shared click handler prevents navigation and opens the accessible full-size viewer.
- Mosaic dimensions and responsive behavior live in [styles/style.css](styles/style.css) and the matching [styles/partials/_portfolio.scss](styles/partials/_portfolio.scss) source.
- The viewer supports a close control, backdrop click, and Escape. Reopening a project is guarded by `data-mosaic-initialized` so the same figures are not wrapped twice.

When debugging an apparently unclickable portfolio link, inspect the browser hit target with `elementFromPoint()` before changing the anchor. The legacy floated project columns can allow a later full-width figure to overlap the metadata area; `#portfolio-ajax-single > figure.portfolio-single-image { clear: both; }` prevents that interception.

The portfolio grid in [views/main.html](views/main.html) must remain a flat list: every `figure.portfolio-item` should be a direct child of `#portfolio`, with one unique `id` and one matching `data-loader`. Stray closing tags or duplicate IDs can make the masonry layout render tiles with incorrect sizes or nesting.

## Development

Install dependencies, then start the development server:

```bash
npm install
npm start
```

BrowserSync serves the project from the repository root at `http://localhost:3000`. Its UI is normally available at `http://localhost:3001`. If those ports are already occupied, the active server may use an alternate port, such as `3002`; use the URL reported by Gulp. The server watches HTML, templates, JavaScript, and SCSS changes and reloads or recompiles the relevant output.

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

## Commit Checklist

- Edit source files under `views/`, `app/`, `js/`, `styles/`, and `images/`; `_build/` is generated by `npm run build`.
- Run `npm run build` and confirm it exits with code `0`.
- Reload `http://localhost:3000` and verify the portfolio grid has one flat tile per project.
- Open representative project tiles, including Oracle, Lightstep, Tenable, and Unity, to verify their AJAX loaders and image mosaics.
- Review `git status` before committing because the legacy build and lint tasks can modify generated/vendor files.

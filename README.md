# Pitstop

Pitstop is a lightweight, framework‑free home and car maintenance log. It runs entirely in the browser and requires no build tools or server.

## Overview

This initial release provides a polished UI shell with four top‑level sections:

* **Dashboard** – shows upcoming tasks and recent service items.
* **Assets** – lists your vehicles and home systems with placeholder cards (click a card to see a toast).
* **Documents** – a simple placeholder card with an inactive upload button.
* **Settings** – lets you pick your preferred units (miles/kilometers) and theme (auto/dark/light). A quick theme toggle lives in the app bar.

The app uses a minimal tab router written in vanilla JavaScript, CSS custom properties for theming, a small toast utility and optional PWA support via a service worker and manifest. There are no external dependencies, trackers or analytics.

## Running locally

Since Pitstop is a static app you can simply open **`index.html`** in your browser. For a more realistic local environment use a tiny HTTP server so the service worker can register properly:

```sh
npx serve .
```

Then navigate to `http://localhost:3000` in your browser. The UI is responsive down to mobile widths (~360 px) and works offline thanks to the included service worker.

## Customizing

* **Styles** – all design tokens and layout rules live in `styles.css`. Modify the custom properties under `:root` to adjust spacing, colors and typography.
* **Behaviour** – tab routing, theming and toast logic are implemented in `app.js`. Edit this file to add more interactivity.
* **Manifest/Service Worker** – update `manifest.webmanifest` and `sw.js` if you change file names or add new assets.
* **Icons** – the PWA icons (`icon-192.png` and `icon-512.png`) are located in the project root and can be replaced with your own artwork.

## Next steps

This release is just the beginning. Future improvements could include:

* **Local data storage** – Use IndexedDB to persist assets, tasks and service records with import/export to JSON.
* **Reminders** – Generate calendar (.ics) files and notifications based on upcoming maintenance.
* **Printable glovebox PDF** – Add a print stylesheet to produce a glovebox‑friendly PDF summary of your maintenance log.
* **Enhanced PWA** – Fine‑tune the service worker, add push notifications and prepare for packaging as a mobile app via Capacitor.

Contributions and feedback are welcome!
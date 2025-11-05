# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Run locally (zero-build):
  - macOS/Linux: `npm start`
  - Windows PowerShell: `npm start`
- Set Ave API key for the server-side proxy (required to use `/api/ave-price`):
  - macOS/Linux: `AVE_API_KEY={{AVE_API_KEY}} npm start`
  - Windows PowerShell:
    - `$env:AVE_API_KEY='{{AVE_API_KEY}}'; npm start`
- Health check: `curl http://localhost:3000/health`
- Test Ave price proxy (after setting `AVE_API_KEY`): `curl http://localhost:3000/api/ave-price`

Notes:
- No build, lint, or test scripts are defined in `package.json`.
- The server binds to `PORT` if provided (defaults to 3000) and respects `NODE_ENV`.

## High-level architecture

This is a static web app served by a minimal Node.js HTTP server, with client-side Web3 integrations and a server-side Ave API proxy.

- HTTP server (`server.js`)
  - Serves static files from the repo root (default route `/` -> `index.html`).
  - Caching: strong caching for JS/CSS/images (1 year, immutable), short cache for HTML (5 minutes); sends ETag and supports 304; gzip compression for html/css/js/json/svg.
  - Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`.
  - Health endpoints: `/health`, `/healthz`.
  - API routing: `/api/ave-price` delegates to `api/ave-price.js` and requires `process.env.AVE_API_KEY`.

- API proxy modules (`api/*`)
  - `api/ave-price.js`: server-side proxy to Ave’s token price endpoint for DP on Berachain; requires `AVE_API_KEY` and returns Ave’s JSON.
  - `api/ave-proxy.js`: generic Ave proxy that forwards arbitrary endpoints. It currently embeds an API key in code; prefer `AVE_API_KEY`-based proxy above.

- Client-side core (`js/*` and top-level modules)
  - `js/common.js`: shared UI and UX utilities (toast/loader), wallet handling (OKX/MetaMask detection, connection, network switch to Berachain 80094), mobile nav, and owner-link gating via `CONFIG.OWNER_ADDRESS`.
  - `js/i18n.js`: string tables for `en` and `zh-TW` used across pages via `window.i18n`.
  - `js/token-icons.js`: resolves token icons (local assets, TrustWallet CDN, or `tokenlist.json`) with caching.
  - `ave-api.js` (window.AveAPI): wraps Ave Data API for DP price/details; client logic switches:
    - Development (localhost/127.0.0.1): fetches Ave directly and needs an API key set in the browser context (constructor arg instead of the placeholder).
    - Production: calls server route `/api/ave-price` to avoid CORS and keep key on server.
    - Simple in-memory cache (10s) to reduce calls; formatting helpers for prices/large numbers.
  - `price-chart.js` (window.DPPriceChart): renders a live DP/USD line chart with Chart.js, updating every 15s and updating associated DOM fields.
  - `kodiak-api.js` (window.KodiakAPI): client wrapper for Kodiak Finance quote API on Berachain (80094); normalizes token addresses, converts human amounts to wei, returns quotes and swap calldata.
  - `swap.js` (SwapManager): orchestrates the Swap UI using `KodiakAPI` and `ethers` (UMD from `js/libs/ethers-5.7.2.umd.min.js`):
    - Reads/writes wallet state; estimates gas with 20% buffer fallback; performs ERC-20 approvals (infinite allowance) and transaction sends via signer; maintains local UI state and localStorage flags.
    - Token list preconfigured for BERA/WBERA/HONEY/DP/USDT/USDC plus custom token entry; uses `token-icons` and DOM event listeners.

- Pages
  - Multiple standalone HTML pages (e.g., `index.html`, `swap.html`, `pass-nft.html`, `t-engine.html`, `gamefi.html`, `whitepaper*.html`) load the above client scripts directly and operate via globals (no bundler).
  - Owner console (`owner/admin.html`) is gated in UI; see `owner/README.md` for usage and security expectations.

## Environment

- `AVE_API_KEY` (server): required by `api/ave-price.js` and the `/api/ave-price` route.
- `PORT` (server): port to bind (`3000` default).
- `NODE_ENV` (server): environment mode (`production` default).

## Gotchas

- Ave API key handling differs by environment:
  - Local development: `AveAPI` defaults to calling Ave directly; pass your key into its constructor in the page code if you develop DP price features locally.
  - Production: front-end fetches `/api/ave-price`; you must set `AVE_API_KEY` on the server process.
- `api/ave-proxy.js` contains a hard-coded key; avoid using this file in production as-is and prefer the env-based proxy.
- No bundler or module system: scripts attach to `window.*` and are loaded per-page; ensure load order in HTML if you add new modules (e.g., `ethers` before `swap.js`).
- The server serves from repo root; new assets/pages must be placed relative to root to be reachable.

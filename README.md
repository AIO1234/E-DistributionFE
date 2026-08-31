# AIO-IT SOLUTIONS Distribution System — Frontend

Frontend for the AIO-IT SOLUTIONS Distribution System: a Vue 3 admin application for managing the order, stock, and payment flow between a factory, distributers, sub-distributers, sales reps, and shops. Built on the Vuexy Vue admin template (Vuetify 3 + Vite).

## Tech Stack

- Vue 3 (`<script setup>`, Composition API)
- Vite 5 with `unplugin-vue-router` (file-based routing) and `unplugin-auto-import`
- Vuetify 3 for UI components
- Pinia + Vuex for state
- Axios / `ofetch` for API calls
- Chart.js / ApexCharts for reporting charts

## Project Structure

- `src/@core` — template core: shared components, composables, chart configs, and base SCSS
- `src/views` — feature modules, organized by domain:
  - `MasterData` — Area, Shop, Distributer, Sales Rep, Courier, Vehicle management
  - `OrderManagement` — Factory, Distributer, Sub-Distributer, Sales Rep, and Shop order flows
  - `StockManagement` — inventory tracking
  - `PaymentManagement` — payments against orders
  - `ReturnManagement` — order/stock returns
  - `ReportManagement` — sales summary and detailed reports
  - `UserManagement` — application users
  - `pages/authentication` — login/auth
- `src/pages` — file-based route entry points (see `unplugin-vue-router`)

## Getting Started

Requires Node `lts/*` (see `.nvmrc`) and pnpm (`packageManager: pnpm@8.6.2`).

```sh
pnpm install
```

Copy `.env.example` to `.env` and set the API base URL:

```
VITE_API_BASE_URL=
```

### Development server

```sh
pnpm dev
```

### Production build

```sh
pnpm build
```

### Preview a production build

```sh
pnpm preview
```

### Lint

```sh
pnpm lint
```

## Docker

`dev.Dockerfile` / `prod.Dockerfile` and the corresponding `docker-compose.dev.yml` / `docker-compose.prod.yml` are provided for containerized development and production deployment, served via `nginx.conf` in production.

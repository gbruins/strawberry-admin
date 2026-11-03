# strawberry-admin

Vue 3 + Vite + TypeScript owner/admin SPA for a multi-tenant pizza ordering platform. Sibling repos: `selloutPizza` (customer storefront), `strawberry-server` (API backend — this app's only data source).

## Stack

Vue Router 4 (pure client-side SPA, `createWebHistory`, no SSR), Pinia (`src/stores/app.ts`), Tailwind CSS 4 + shadcn-vue/reka-ui components (`src/components/ui/*`: button, dialog, sheet, sidebar, table, etc. — `components.json` confirms the shadcn-vue config), vue-i18n, Vuelidate for forms, axios (`src/plugins/api.js`) + Supabase Auth (`src/plugins/supabase.js`) for the owner session. `@supabase/supabase-js` is already a dependency, so Realtime is available with no new install.

## Auth

- Owner login: Supabase Auth JWT. The axios request interceptor in `src/plugins/api.js` unconditionally calls `supabase.auth.getSession()` and attaches the result as `Authorization: Bearer` — this is the one spot that would need to branch if a second, independent auth domain (e.g. a shared kitchen-station session) is ever added, since it's a shared singleton used by every page.
- The router guard (`src/router/index.ts`) only checks "is a session present" (`appStore.loggedInUser`), not role. `role`/`isPlatformStaff` are fetched into `useAppStore` from `/admin/me` but nothing in the UI branches on them as of this writing.
- Any second auth domain (shared device/station login, non-owner role, etc.) should get its own Pinia store, its own token, and routes under its own path prefix with an early-exit branch in the router guard — never layered on top of the owner Supabase session.

## Tenant/order model

No tenant "settings" page exists by default — `tenantId`/`tenantName`/`timezone` are loaded into `useAppStore` for display/scoping only, with no edit UI. Orders are shown via `src/pages/CartsPage.vue`/`CartPage.vue` as "Carts," with only a binary Open/Closed badge derived from `closed_at` — no fulfillment-state workflow by default. Data loads once per view via a plain axios GET; no polling/websockets/Realtime subscription exists in this app by default — the only live mechanism present is a `BroadcastChannel` used for cross-tab logout, unrelated to data sync.

## UI conventions

shadcn-vue/reka-ui + Tailwind 4. Table/Badge/Dialog/Sheet/Sidebar primitives already exist and should be reused for any new list/board/settings UI rather than hand-rolled equivalents. `DefaultLayout.vue` is a desktop sidebar shell — not touch/kiosk-oriented; a touch-first feature needs its own layout component. No drag-and-drop library is in `package.json` by default.

## Deployment

Render static site; build is `npm ci && npm run build-only`, SPA rewrite `/* → /index.html`. Config lives centrally in `selloutPizza/render.yaml`, not in this repo. Env vars: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

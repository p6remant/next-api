# Requirements: Next.js Full-Stack API Integration Architecture

## 1. Project Overview

A clean, DRY, scalable, and type-safe API integration architecture for Next.js App Router. The goal is to standardize data fetching across client-side and server-side components, ensure backend endpoints remain confidential from browser network observers, streamline cookie-based JWT session handling, and eliminate duplicated HTTP logic.

---

## 2. Core Architectural Principles

### 2.1 Request Routing Models

1. **Client-Side Data Flow (Masked via Next.js Route Handlers)**
   - **Path**: `Client Component (UI / React Hook) -> Next.js Route Handler (/api/auth/...) -> External Backend API`.
   - **Constraint**: The external backend URL must **never** be exposed in the browser's DevTools Network panel. The browser only sees internal relative paths (e.g., `POST /api/auth/login`).
   - **Credential Handling**: Client-side requests automatically dispatch cookies via `credentials: 'include'`.

2. **Server-Side Data Flow (Direct Server-to-Server)**
   - **Path**: `React Server Component (RSC) -> Server Service -> External Backend API`.
   - **Constraint**: Server components bypass internal Next.js `/api` route handlers to avoid unnecessary local network hops, connecting directly to the external backend using the server-only client.

---

## 3. Scope of HTTP Layer & Client Abstractions

The system consolidates HTTP operations into three distinct modules:

| Module | Location | Target | Description |
|---|---|---|---|
| **Base HTTP Core** | `src/lib/api/http.ts` | Abstract | Unified fetch wrapper (`createHttpClient`) handling query string composition, header merging, payload serialization, and unified `HttpError` parsing. Replaces scattered query builders and duplicate fetch logic. |
| **Client API Client** | `src/lib/api/client.ts` | Internal (`/api/...`) | Configured with a relative base URL (`''`) and `credentials: 'include'` for calling Next.js Route Handlers. |
| **Server API Client** | `src/lib/api/server.ts` | External Backend | Marked with `'server-only'`. Points to `API_BASE_URL` and automatically extracts the session token via `getAccessToken()` to attach the `Authorization: Bearer <token>` header. |

---

## 4. Token & Session Management Requirements

### 4.1 Storage & Lifecycles
- Session tokens must be stored exclusively in `HttpOnly`, `Secure` (production), `SameSite: 'lax'` cookies managed on the server side:
  - **Access Token**: Key `player_access_token`, max age: 7 days (`60 * 60 * 24 * 7`).
  - **Refresh Token**: Key `player_refresh_token`, max age: 30 days (`60 * 60 * 24 * 30`).

### 4.2 Endpoint Specifications
1. **Login (`POST /api/auth/login`)**:
   - Forwards credentials to backend `POST /player-hub/auth/login`.
   - Extracts access/refresh tokens from the response envelope (normalizing top-level and nested response structures).
   - Writes `player_access_token` and `player_refresh_token` cookies to the response.
   - Preserves backend HTTP status and error body on failure.

2. **Registration (`POST /api/auth/register`)**:
   - Forwards registration payload to backend `POST /player-hub/auth/register`.
   - If the backend returns session tokens upon sign-up, stores them as cookies; otherwise returns status `201`.
   - Preserves backend HTTP status and validation errors on failure.

3. **Refresh Token (`POST /api/auth/refresh-token`)**:
   - Reads `player_refresh_token` from the incoming request cookie.
   - Forwards token to backend `POST /player-hub/auth/refresh-token` via the `Cookie` header.
   - Sets a fresh `player_access_token` cookie upon success.
   - Does **not** rotate or overwrite the existing `player_refresh_token`.
   - Returns status `401` if the refresh cookie is absent or expired.

4. **Logout (`POST /api/auth/logout`)**:
   - Deletes both `player_access_token` and `player_refresh_token` cookies.

---

## 5. File Structure Requirements

```text
src/
├── constants/
│   └── api-routes.ts            # External endpoints, internal client routes, cookie keys
├── types/
│   ├── api.ts                   # Universal HTTP request/response types & envelopes
│   ├── auth.ts                  # Payloads & response contracts for auth domains
│   └── banner.ts                # Promotional banner response contracts
├── lib/
│   └── api/
│       ├── http.ts              # Core fetch engine (query serialization, HttpError, createHttpClient)
│       ├── token.ts             # 'server-only' cookie accessors (get/set/clear tokens)
│       ├── client.ts            # Client HTTP client (targets /api/...)
│       └── server.ts            # 'server-only' direct backend client (injects bearer token)
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── register/route.ts
│   │       ├── refresh-token/route.ts
│   │       └── logout/route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx       # Consumes useLoginMutation
│   │   └── register/page.tsx    # Consumes useRegisterMutation
│   └── (pages)/
│       └── page.tsx             # RSC invoking getGamesBanner directly
├── hooks/
│   └── use-mutation.ts          # Minimal, generic mutation hook for client components
└── services/
    ├── auth.ts                  # Client authentication mutation hooks & service functions
    └── banner.ts                # Server-only data fetchers


---

## 6. Code Simplification & Refactoring Criteria

1. **Eliminate Redundant Files & Logic**:
   - Remove standalone `query-builder.ts` by folding URL normalization directly into `http.ts`.
   - Remove redundant backward-compatibility aliases (e.g., `getAuthToken` alias of `getStoredAccessToken`).
   - Eliminate duplicated token extraction cascades by writing a single shared utility (`extractAuthTokens(data)`).
2. **Unified Error Handling**:
   - Standardize on `HttpError` containing status code and response payload.
   - In Route Handlers, write a single reusable helper (`handleRouteError(error)`) to return the exact backend status code and message rather than repeating identical catch blocks across routes.
3. **Strict Boundaries**:
   - Ensure all server cookie accessors and server-facing callers include `'server-only'`.
   - Ensure all form mutations and browser clients remain client-safe (`'use client'`).

---

## 7. Acceptance Criteria & Verification

### Automated Verification
- [ ] TypeScript type checks complete without errors (`npm run typecheck`).
- [ ] Linter rules pass across all modified and newly added files (`npm run lint`).

### Manual & Security Verification
- [ ] **Network Masking**: In browser DevTools Network tab, inspect login, register, and refresh calls. Verify only relative Next.js paths (`/api/auth/...`) appear. No external domain (`vgaming.gg`) should be visible in client requests.
- [ ] **Cookie Security**: Verify that `player_access_token` and `player_refresh_token` are set with `HttpOnly: true`, `SameSite: Lax`, and `Path: /`.
- [ ] **Token Refresh**: Triggering `POST /api/auth/refresh-token` updates the `player_access_token` cookie without breaking or changing the `player_refresh_token`.
- [ ] **Error Code Forwarding**: When backend validation fails (e.g., 400 Bad Request, 422 Unprocessable Entity, 401 Unauthorized), the internal route returns the exact same status code and field error payload to the client form.
- [ ] **RSC Isolation**: Server components retrieve backend data (e.g., promotional banners) without issuing HTTP requests through the browser.
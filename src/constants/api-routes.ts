export const API_BASE_URL = (
  process.env.API_URL || 'https://api-dev.vgaming.gg/api/v1'
).replace(/\/+$/, '');

export const NEXT_PROXY_PATH_PREFIX = '/api/proxy';

export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: 'player_access_token',
  REFRESH_TOKEN: 'player_refresh_token',
} as const;

// External backend endpoints (used by serverApi / Route Handlers)
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/player-hub/auth/register',
    LOGIN: '/player-hub/auth/login',
    REFRESH_TOKEN: '/player-hub/auth/refresh-token',
  },
  BANNER: {
    GAMES: '/player-hub/games/banner',
  },
} as const;

// Internal Next.js API routes (called by clientApi from the browser)
export const CLIENT_API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
  },
} as const;

export interface LoginPayload {
  email: string;
  password?: string;
  [key: string]: unknown;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  promoCode?: string;
  [key: string]: unknown;
}

export interface LoginResponseData {
  token?: string;
  expiresIn?: number;
  user?: Record<string, unknown>;
}

export interface RegisterResponseData {
  userId?: string;
  message?: string;
}

// constants.js
export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export const AUTH_ROUTES = "api/auth";
export const SIGN_UP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
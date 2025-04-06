
export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export const AUTH_ROUTES = "api/auth";
export const SIGN_UP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const   LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;


export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACTS = `${CONTACT_ROUTES}/search`;


export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTES = `${MESSAGES_ROUTES}/get-messages`;
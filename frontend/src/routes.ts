export enum AppRoutes {
  HOME = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
}
/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const APP_PUBLIC_ROUTES = [AppRoutes.HOME.toString()];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to default login redirect
 * @type {string[]}
 */
export const APP_AUTH_ROUTES = [AppRoutes.LOGIN.toString()];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authantication purpouses
 * @type {string}
 */
export const API_AUTH_PREFIX = '/api/auth';

/**
 * The default redirect route after a successful login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = AppRoutes.DASHBOARD.toString();

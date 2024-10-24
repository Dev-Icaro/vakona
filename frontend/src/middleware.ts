import { auth } from '@/config/auth';
import { API_AUTH_PREFIX, AppRoutes, APP_AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, APP_PUBLIC_ROUTES } from '@/routes';

export default auth(req => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = APP_PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = APP_AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(AppRoutes.LOGIN, nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

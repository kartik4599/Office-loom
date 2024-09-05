import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextRequest } from "next/server";
const isAuthPage = createRouteMatcher(["/auth"]);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default convexAuthNextjsMiddleware((request: NextRequest) => {
  if (!isAuthPage(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
  if (isAuthPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

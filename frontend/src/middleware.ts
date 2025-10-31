import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/api/webhooks(.*)",
    "/api/auth(.*)"  // Allow backend auth routes
  ],
  ignoredRoutes: [
    "/((?!api|trpc))(_next|.+..+)(.*)",
    "/api/webhooks(.*)"
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl;

  // If the user is not authenticated
  if (!session?.user) {
    // Allow unauthenticated users to access only "home", "signin", and "signup"
    if (
      url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup")
    ) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access other routes with a specific message
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set(
      "message",
      "Please login first to access this page."
    );
    return NextResponse.redirect(redirectUrl);
  } else {
    // If the user is authenticated
    if (
      url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup")
    ) {
      // Redirect authenticated users away from signin/signup with a message
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("message", "You are already logged in.");
      return NextResponse.redirect(redirectUrl);
    }

    // Handle route access based on user role
    // if (session.user.role === "user") {
    //   if (url.pathname.startsWith("/dashbord")) {
    //     // Redirect "user" role trying to access "dashboard" to "profile" with a message
    //     const redirectUrl = new URL("/profile", request.url);
    //     redirectUrl.searchParams.set(
    //       "message",
    //       "Dashboard is restricted. You have been redirected to your profile."
    //     );
    //     return NextResponse.redirect(redirectUrl);
    //   }
    // } else if (session.user.role === "admin") {
    //   // Admins have access to all routes except "signin" and "signup"
    //   return NextResponse.next();
    // }
  }

  // Allow the request to proceed for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/rules",
    "/profile",
    "/guess",
    "/",
    "/highestScore",
  ], // Match the required routes
};

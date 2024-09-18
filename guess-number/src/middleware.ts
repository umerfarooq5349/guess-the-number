import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

export const runtime = "nodejs";

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

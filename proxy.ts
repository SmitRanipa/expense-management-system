import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ===============================
    // 1️⃣ Not authenticated
    // ===============================
    if (!token) {
      // Public routes
      if (
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/api/auth")
      ) {
        return NextResponse.next();
      }

      // Everything else → login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ===============================
    // 2️⃣ Authenticated user
    // ===============================
    const role = token.role as "ADMIN" | "EMPLOYEE";

    // ❌ Logged-in users should NOT access login/register
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(
        new URL(
          role === "ADMIN"
            ? "/admin/dashboard"
            : "/employee/dashboard",
          req.url
        )
      );
    }

    // ===============================
    // 3️⃣ Role-based route protection
    // ===============================
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/employee/dashboard", req.url)
      );
    }

    if (pathname.startsWith("/employee") && role !== "EMPLOYEE") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // we handle everything manually
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

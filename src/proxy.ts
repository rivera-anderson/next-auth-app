import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import type { NextFetchEvent } from "next/server";

const authProxy = withAuth({
  pages: { signIn: "/signIn" },
});

export function proxy(req: NextRequestWithAuth, event: NextFetchEvent) {
  return authProxy(req, event);
}

export const config = { matcher: ["/dashboard", "/profile"] };

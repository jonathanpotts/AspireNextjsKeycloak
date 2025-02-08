"use client";

import type { Session } from "next-auth";
import { SessionProvider, signIn } from "next-auth/react";
import type React from "react";
import { useEffect } from "react";

export default function AuthSessionProvider({
  session,
  children,
}: {
  session?: Session | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      signIn("keycloak");
    }
  }, [session]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}

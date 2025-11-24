"use client";

import { Button } from "@mui/material";
import { authClient } from "@/auth-client";

export default function SignInButton() {
  return (
    <Button
      variant="contained"
      onClick={() => authClient.signIn.oauth2({ providerId: "keycloak" })}
    >
      Sign in
    </Button>
  );
}

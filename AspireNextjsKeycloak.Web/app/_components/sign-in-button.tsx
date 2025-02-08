"use client";

import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <Button variant="contained" onClick={() => signIn("keycloak")}>
      Sign in
    </Button>
  );
}

"use client";

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <Button variant="contained" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}

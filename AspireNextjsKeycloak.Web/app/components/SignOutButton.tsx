"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
          },
        })
      }
    >
      Sign out
    </Button>
  );
}

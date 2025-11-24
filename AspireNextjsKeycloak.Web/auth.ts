import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { getServiceEndpoint } from "./service-discovery";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "build-only-secret",
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_ID!,
          clientSecret: process.env.KEYCLOAK_SECRET!,
          discoveryUrl: `${getServiceEndpoint("keycloak")}/realms/${process.env.KEYCLOAK_REALM}/.well-known/openid-configuration`,
          scopes: [
            "openid",
            "email",
            "profile",
            "offline_access",
            ...(process.env.KEYCLOAK_SCOPE
              ? process.env.KEYCLOAK_SCOPE.split(" ")
              : []),
          ],
        },
      ],
    }),
  ],
});

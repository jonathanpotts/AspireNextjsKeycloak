import { getKeycloakIssuer } from "@/service-discovery";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const keycloakIssuer = getKeycloakIssuer(
  "keycloak",
  process.env.KEYCLOAK_REALM!,
);

export const config: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: keycloakIssuer,
      authorization: {
        params: {
          scope:
            `openid email profile offline_access ${process.env.KEYCLOAK_SCOPE ?? ""}`.trim(),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
          idToken: account.refresh_token ? undefined : account.id_token,
        };
      }

      if (!token.expiresAt) {
        throw new TypeError("Missing expiresAt");
      }

      if (Date.now() < token.expiresAt * 1000) {
        return token;
      }

      if (!token.refreshToken) {
        console.error("Missing refreshToken");

        return {
          ...token,
          error: "RefreshTokenError",
        };
      }

      try {
        const response = await fetch(
          `${keycloakIssuer}/protocol/openid-connect/token`,
          {
            method: "post",
            body: new URLSearchParams({
              client_id: process.env.KEYCLOAK_ID!,
              client_secret: process.env.KEYCLOAK_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken,
            }),
          },
        );

        const tokensOrError = await response.json();

        if (!response.ok) {
          throw tokensOrError;
        }

        const newTokens = tokensOrError as {
          access_token: string;
          expires_in: number;
          refresh_token?: string;
        };

        return {
          ...token,
          accessToken: newTokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
          refreshToken: newTokens.refresh_token
            ? newTokens.refresh_token
            : token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing accessToken", error);

        return {
          ...token,
          error: "RefreshTokenError",
        };
      }
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        error: token.error,
      };
    },
  },
  events: {
    async signOut({ token }) {
      if (token.refreshToken) {
        await fetch(`${keycloakIssuer}/protocol/openid-connect/logout`, {
          method: "post",
          body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_ID!,
            client_secret: process.env.KEYCLOAK_SECRET!,
            refresh_token: token.refreshToken,
          }),
        });
      } else if (token.idToken) {
        const logOutUrl = new URL(
          `${keycloakIssuer}/protocol/openid-connect/logout`,
        );
        logOutUrl.searchParams.set("id_token_hint", token.idToken);
        await fetch(logOutUrl);
      }
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    idToken?: string;
    error?: "RefreshTokenError";
  }
}

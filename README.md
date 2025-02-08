# AspireNextjsKeycloak
Example project using [.NET Aspire](https://dotnet.microsoft.com/apps/cloud) with a [Next.js](https://nextjs.org/) ([React](https://react.dev/)) frontend, an [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet/apis) backend, and [Keycloak](https://www.keycloak.org/) for authentication.

## Requirements
This project requires the following:
* [.NET](https://dotnet.microsoft.com/) SDK 8.0 or later
  * ASP.NET Core Runtime 8.0
* [Node.js](https://nodejs.org/) 18.18 or later
* [Docker Desktop](https://www.docker.com/) or [Podman](https://podman.io/)

## Running
To run this project, do the following:
1. In the `AspireNextjsKeycloak.Web` directory, run: `npm ci`
2. Start Docker Desktop or Podman if it is not already running
3. Either:
   * In the `AspireNextjsKeycloak.AppHost` directory, run: `dotnet run -lp https` and then open the dashboard using the URL output to the console
   * Open `AspireNextjsKeycloak.sln` in Visual Studio and run the `AspireNextjsKeycloak.AppHost` project

The default users are:
| Username | Password |
| - | - |
| alice | alice |
| bob | bob |

## Projects
### AspireNextjsKeycloak.AppHost
An [Aspire app host](https://learn.microsoft.com/dotnet/aspire/fundamentals/app-host-overview) which handles orchestration and hosts the [Aspire dashboard](https://learn.microsoft.com/dotnet/aspire/fundamentals/dashboard/overview).

**Uses:**
* **[Aspire.Hosting.Keycloak](https://learn.microsoft.com/dotnet/aspire/authentication/keycloak-integration#hosting-integration)** - Handles starting up the Keycloak container and importing the realm data
* **[Aspire.Hosting.NodeJs](https://learn.microsoft.com/dotnet/aspire/get-started/build-aspire-apps-with-nodejs)** - Handles launching and configuring the Node.js-based frontend project

### AspireNextjsKeycloak.ApiService
An ASP.NET Core [minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis/overview?view=aspnetcore-8.0) backend which requires authorization from Keycloak.

**Uses:**
* **[Aspire.Keycloak.Authentication](https://learn.microsoft.com/dotnet/aspire/authentication/keycloak-integration#client-integration)** - Handles configuring authentication settings for Keycloak

### AspireNextjsKeycloak.Web
A Next.js frontend using the [App Router](https://nextjs.org/docs/app) and [React Server Components](https://react.dev/reference/rsc/server-components) that authenticates the user and displays data from the backend.

**Uses:**
* **[OpenTelemetry](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)** - Adds observability to the Next.js server (modified to support GRPC endpoints when using the Node.js runtime)
* **[NextAuth.js](https://next-auth.js.org/)** - Handles the auth flows
* **[Material UI](https://mui.com/material-ui/)** - Provides [Material Design 2](https://m2.material.io/) based components for React

## Notice
Please do not use the realm data from this repository in production as the secrets are exposed to the public.

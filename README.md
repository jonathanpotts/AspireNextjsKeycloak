# AspireNextjsKeycloak
Example project using [Aspire](https://aspire.dev/) with a [Next.js](https://nextjs.org/) ([React](https://react.dev/)) frontend, an [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet/apis) backend, and [Keycloak](https://www.keycloak.org/) for authentication.

## Requirements
This project requires the following:
* [.NET](https://dotnet.microsoft.com/) SDK 10.0 or later
* [Node.js](https://nodejs.org/) 20.9.0 or later
* [Docker Desktop](https://www.docker.com/) or [Podman](https://podman.io/)

## Running
To run this project, do the following:
1. Start Docker Desktop or Podman if it is not already running
2. In the repo directory, run `dotnet tool restore` followed by `dotnet aspire run` and then open the dashboard using the URL output to the console

The default users are:
| Username | Password |
| - | - |
| alice | alice |
| bob | bob |

## Projects
### AspireNextjsKeycloak.AppHost
An [Aspire app host](https://aspire.dev/get-started/app-host/) which handles orchestration and hosts the [Aspire dashboard](https://aspire.dev/dashboard/overview/).

**Uses:**
* **[Aspire.Hosting.Keycloak](https://aspire.dev/integrations/security/keycloak/)** - Handles starting up the Keycloak container and importing the realm data
* **[Aspire.Hosting.JavaScript](https://aspire.dev/integrations/frameworks/javascript/)** - Handles launching and configuring the Node.js-based frontend project

### AspireNextjsKeycloak.ApiService
An ASP.NET Core [minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/apis?view=aspnetcore-10.0) backend which requires authorization from Keycloak.

**Uses:**
* **[Aspire.Keycloak.Authentication](https://aspire.dev/integrations/security/keycloak/)** - Handles configuring authentication settings for Keycloak

### AspireNextjsKeycloak.Web
A Next.js frontend using the [App Router](https://nextjs.org/docs/app) and [React Server Components](https://react.dev/reference/rsc/server-components) that authenticates the user and displays data from the backend.

**Uses:**
* **[OpenTelemetry](https://nextjs.org/docs/app/guides/open-telemetry)** - Adds observability to the Next.js server (modified to support gRPC endpoints when using the Node.js runtime)
* **[Better Auth](https://www.better-auth.com/)** - Handles the auth flows
* **[Material UI](https://mui.com/material-ui/) (a.k.a. MUI)** - Provides [Material Design 2](https://m2.material.io/)-based components for React

## Notice
Please do not use the realm data from this repository in production as the secrets are exposed to the public.

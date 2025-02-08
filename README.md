# AspireNextjsKeycloak
Example project using .NET Aspire with a Next.js frontend, an ASP.NET Core backend, and Keycloak for authentication.

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
3. In the `AspireNextJsKeycloak.AppHost` directory, run: `dotnet run -lp https`

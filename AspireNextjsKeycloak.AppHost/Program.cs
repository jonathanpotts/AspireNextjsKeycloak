using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var keycloak = builder
    .AddKeycloak("keycloak", 8080)
    .WithDataVolume()
    .WithRealmImport("./KeycloakRealms");

const string keycloakRealm = "AspireNextjsKeycloak";

var apiService = builder
    .AddProject<Projects.AspireNextjsKeycloak_ApiService>("apiservice")
    .WithEnvironment("KEYCLOAK__REALM", keycloakRealm)
    .WithEnvironment("KEYCLOAK__CLIENTID", "apiservice")
    .WithReference(keycloak)
    .WaitFor(keycloak);

var nextauthSecret = builder.AddParameter(
    "nextauth-secret",
    new GenerateParameterDefault { MinLength = 32, Special = false },
    secret: true,
    persist: true
);

var webFrontend = builder
    .AddNpmApp("webfrontend", "../AspireNextjsKeycloak.Web", "dev")
    .WithHttpEndpoint(3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("NEXTAUTH_SECRET", nextauthSecret)
    .WithEnvironment("KEYCLOAK_REALM", keycloakRealm)
    .WithEnvironment("KEYCLOAK_ID", "webfrontend")
    .WithEnvironment("KEYCLOAK_SECRET", "O94wFQrYPY4Eg2AZvMUQFR71203FwC1r")
    .WithEnvironment("KEYCLOAK_SCOPE", "apiservice")
    .WithReference(keycloak)
    .WithReference(apiService)
    .WaitFor(keycloak)
    .WaitFor(apiService)
    .PublishAsDockerFile();

var launchProfile =
    builder.Configuration["DOTNET_LAUNCH_PROFILE"]
    ?? builder.Configuration["AppHost:DefaultLaunchProfileName"]; // work around https://github.com/dotnet/aspire/issues/5093
if (builder.Environment.IsDevelopment() && launchProfile == "https")
{
    // Disable TLS certificate validation in development, see https://github.com/dotnet/aspire/issues/3324 for more details.
    webFrontend.WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", "0");
}

builder.Build().Run();

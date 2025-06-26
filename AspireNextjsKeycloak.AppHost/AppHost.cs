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
    .WithHttpHealthCheck("/health")
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
    .WaitFor(keycloak)
    .WithReference(apiService)
    .WaitFor(apiService)
    .PublishAsDockerFile();

var launchProfile = builder.Configuration["DOTNET_LAUNCH_PROFILE"];
if (builder.Environment.IsDevelopment() && launchProfile == "https")
{
    webFrontend.RunWithHttpsDevCertificate("HTTPS_CERT_FILE", "HTTPS_CERT_KEY_FILE");
}

builder.Build().Run();

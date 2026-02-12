var builder = DistributedApplication.CreateBuilder(args);

var keycloak = builder
    .AddKeycloak("keycloak", 8080)
    .WithDataVolume()
    .WithRealmImport("./KeycloakRealms");

var keycloakRealm = builder.AddParameter("keycloak-realm", "AspireNextjsKeycloak");
var keycloakClientId = builder.AddParameter("keycloak-client-id", "apiservice");

var apiService = builder
    .AddProject<Projects.AspireNextjsKeycloak_ApiService>("apiservice")
    .WithEnvironment("KEYCLOAK__REALM", keycloakRealm)
    .WithEnvironment("KEYCLOAK__CLIENTID", keycloakClientId)
    .WithHttpHealthCheck("/health")
    .WithReference(keycloak)
    .WaitFor(keycloak);

var betterAuthSecret = builder.AddParameter(
    "better-auth-secret",
    new GenerateParameterDefault { MinLength = 32, Special = false },
    secret: true,
    persist: true
);
var betterAuthUrl = builder.AddParameter(
    "better-auth-url",
    "http://webfrontend-aspirenextjskeycloak.dev.localhost:3000"
);
var keycloakId = builder.AddParameter("keycloak-id", "webfrontend");
var keycloakSecret = builder.AddParameter(
    "keycloak-secret",
    "O94wFQrYPY4Eg2AZvMUQFR71203FwC1r",
    secret: true
);
var keycloakScope = builder.AddParameter("keycloak-scope", "apiservice");

var webFrontend = builder
    .AddJavaScriptApp("webfrontend", "../AspireNextjsKeycloak.Web")
    .WithHttpEndpoint(3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("BETTER_AUTH_SECRET", betterAuthSecret)
    .WithEnvironment("BETTER_AUTH_URL", betterAuthUrl)
    .WithEnvironment("KEYCLOAK_REALM", keycloakRealm)
    .WithEnvironment("KEYCLOAK_ID", keycloakId)
    .WithEnvironment("KEYCLOAK_SECRET", keycloakSecret)
    .WithEnvironment("KEYCLOAK_SCOPE", keycloakScope)
    .WithReference(keycloak)
    .WaitFor(keycloak)
    .WithReference(apiService)
    .WaitFor(apiService)
    .PublishAsDockerFile();

builder.Build().Run();

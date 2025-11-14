var builder = DistributedApplication.CreateBuilder(args);

var keycloak = builder
    .AddKeycloak("keycloak", 8080)
    .WithDataVolume()
    .WithRealmImport("./KeycloakRealms");

var keycloakRealm = builder.AddParameter("keycloak-realm", "AspireNextjsKeycloak");

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
var nextauthUrl = builder.AddParameter(
    "nextauth-url",
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
    .WithEnvironment("NEXTAUTH_SECRET", nextauthSecret)
    .WithEnvironment("NEXTAUTH_URL", nextauthUrl)
    .WithEnvironment("KEYCLOAK_REALM", keycloakRealm)
    .WithEnvironment("KEYCLOAK_ID", keycloakId)
    .WithEnvironment("KEYCLOAK_SECRET", keycloakSecret)
    .WithEnvironment("KEYCLOAK_SCOPE", keycloakScope)
    .WithReference(keycloak)
    .WaitFor(keycloak)
    .WithReference(apiService)
    .WaitFor(apiService)
    .PublishAsDockerFile();

if (builder.ExecutionContext.IsRunMode)
{
    webFrontend.WithEnvironment("NEXTAUTH_URL_INTERNAL", webFrontend.GetEndpoint("http"));
}

builder.Build().Run();

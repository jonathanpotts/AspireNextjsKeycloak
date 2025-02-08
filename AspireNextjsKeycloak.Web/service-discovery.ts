export function getServiceEndpoint(serviceName: string) {
  return (
    process.env[`services__${serviceName}__https__0`] ??
    process.env[`services__${serviceName}__http__0`]
  );
}

export function getKeycloakIssuer(serviceName: string, realm: string) {
  return `${getServiceEndpoint(serviceName)}/realms/${realm}`;
}

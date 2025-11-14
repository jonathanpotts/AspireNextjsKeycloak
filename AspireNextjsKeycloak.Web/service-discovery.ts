export function getServiceEndpoint(serviceName: string) {
  return (
    process.env[`${serviceName.toUpperCase()}_HTTPS`] ??
    process.env[`${serviceName.toUpperCase()}_HTTP`]
  );
}

export function getKeycloakIssuer(serviceName: string, realm: string) {
  return `${getServiceEndpoint(serviceName)}/realms/${realm}`;
}

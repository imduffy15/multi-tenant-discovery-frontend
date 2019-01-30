export const oidcSettings = {
  authority: "/auth/realms/example-realm",
  client_id: "tenant-manager",
  redirect_uri: window.location.origin + "/oidc-callback",
  response_type: "id_token token",
  scope: "openid profile",
  post_logout_redirect_uri: window.location.origin
};

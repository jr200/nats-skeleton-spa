# nats-skeleton-spa

This is a skeleton single-page-app using vite, react, and nats via rxjs. Components are:

- Third-party OIDC IdP, tested using [Zitadel](https://github.com/zitadel/zitadel).
- [jr200/vault-actions](https://github.com/jr200/vault-actions) to bootstrap roles and policies in vault
- [jr200/nats-iam-broker](https://github.com/jr200/nats-iam-broker) decentralised auth-callout component configured to work with the same OIDC IdP.
- [vault-agent-sidecar-injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) to inject the sentinel account credentials (needed for the decentralised auth-callout).
- RxJS wrapper for NATS provider (for now, from https://github.com/captain-refactor/rx-nats - thanks for sharing!)

## Installation

Create new application+users in your OIDC IdP with:

- authentication flow PKCE.
- redirect uri(s): `https://www.example.com/callback`, `http://localhost:5173/callback`
- post_redirect uri(s): `https://www.example.com`, `http://localhost:5173`

### Installation (local development)

1. Fill in a `.env.local` as per the `.env.template` file, and add an entry for `VITE_NATS_NOBODY_CREDS_B64`.
   e.g.,

   ```
   creds=`vault read -field=creds -format=table nats/creds/operator/my-op/account/my-acct/user/nobody | base64`
   echo "VITE_NATS_NOBODY_CREDS_B64=${creds}" >> .env.local
   ```

2. Install and run: `npm install && npm run dev`

### Installation (helm-chart)

Add the 'jr200' public helm-charts repo:

```
helm repo add jr200 https://jr200.github.io/helm-charts/
helm repo update
```

Pull down a copy of the `values.yml`

```
helm show values jr200/nats-skeleton-spa > values.yml
```

Configure the following in the _values.yml_:

| Parameter                              | Description                                          | Default Value                 |
| -------------------------------------- | ---------------------------------------------------- | ----------------------------- |
| `devDebug`                             | Enable development debugging for the application.    | `false`                       |
| `config.authIdp.uri`                   | OIDC identity provider URI.                          | `''`                          |
| `config.authIdp.clientId`              | OIDC client ID for authentication.                   | `''`                          |
| `config.authIdp.scope`                 | Scopes for OIDC authentication.                      | `openid email offline_access` |
| `config.authIdp.redirectUri`           | Redirect URI after authentication.                   | `''`                          |
| `config.authIdp.postLogoutRedirectUri` | Post-logout redirect URI.                            | `''`                          |
| `config.nats.ssl`                      | Use SSL for NATS connection.                         | `true`                        |
| `config.nats.uri`                      | NATS server URI.                                     | `nats.nats.svc:4222`          |
| `config.nginx.ssl`                     | Enable SSL in NGINX.                                 | `true`                        |
| `config.nginx.errorLogLevel`           | NGINX error log level.                               | `info`                        |
| `ingress.enabled`                      | Enable ingress controller for the service.           | `false`                       |
| `ingress.className`                    | Ingress class to use (e.g., HAProxy).                | `''`                          |
| `ingress.annotations`                  | Annotations for the ingress resource.                | `{}`                          |
| `ingress.hosts`                        | Hosts for the ingress resource.                      | `''`                          |
| `ingress.tls.secretName`               | Name of the TLS secret for ingress.                  | `''`                          |
| `extraEnv`                             | Extra environment variables to add to the container. | `[]`                          |

The `nobody` user credentials can be hardcoded in `extraEnv[0]{.name['VITE_NATS_NOBODY_CREDS_B64'], .value['...']}`, or alternatively supplied using vault and vault-actions. If the latter, also configure the following:

| Parameter                              | Description                                               | Default Value                                           |
| -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `vault.enabled`                        | Enable Vault integration.                                 | `false`                                                 |
| `vault.url`                            | URL of the Vault server.                                  | `https://vault.vault.svc`                               |
| `vault.authMount`                      | Vault auth mount point for Kubernetes.                    | `auth/kubernetes`                                       |
| `vault.nobodyReaderRole`               | Role in Vault for the SPA to assume.                      | `my-nats-skeleton-spa-role`                             |
| `vault.nobodyAccount`                  | Account for Vault's credentials.                          | `nats/creds/operator/my-op/account/my-acct/user/nobody` |
| `vault-actions.enabled`                | Enable or disable Vault actions for policy management.    | `false`                                                 |
| `vault-actions.hookConfiguration.hook` | Hook phase for Vault actions (pre-install, post-install). | `pre-install`                                           |
| `vault-actions.bootstrapToken`         | Bootstrap token for Vault actions.                        | `null`                                                  |
| `vault-actions.secretName`             | Name of the secret for Vault actions bootstrap.           | `va-bootstrap-secret`                                   |
| `vault-actions.policyName`             | Name of the created policy for Vault agent injector.      | `my-nats-skeleton-spa-policy`                           |

# References

- Netflix RxJS talk: https://www.youtube.com/watch?v=AslncyG8whg
- RxJS NATS library: https://github.com/captain-refactor/rx-nats
- RxJS Pokemon Deck Tutorial: https://www.youtube.com/watch?v=s6nG0byDI-o

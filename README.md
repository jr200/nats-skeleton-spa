# nats-skeleton-spa

This is a skeleton single-page-app using vite, react, and nats via rxjs. Components are:

- Third-party OIDC IdP, tested using [Zitadel](https://github.com/zitadel/zitadel).
- [jr200/vault-actions](https://github.com/jr200/vault-actions) to bootstrap roles and policies in vault
- [jr200/nats-iam-broker](https://github.com/jr200/nats-iam-broker) decentralised auth-callout component configured to work with the same OIDC IdP.
- [vault-agent-sidecar-injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) to inject the sentinel account credentials (needed for the decentralised auth-callout).
- RxJS wrapper for NATS provider (for now, from https://github.com/captain-refactor/rx-nats - thanks for sharing!)

## Installation (Local)

1. Create new application+users in your OIDC IdP with:

   - authentication flow PKCE.
   - redirect uri(s): `https://www.example.com/callback`, `http://localhost:5173/callback`
   - post_redirect uri(s): `https://www.example.com`, `http://localhost:5173`

2. Fill in a `.env.local` as per the `.env.template` file, and add an entry for `VITE_NATS_NOBODY_CREDS_B64`.
   e.g.,

   ```
   creds=`vault read -field=creds -format=table nats/creds/operator/my-op/account/my-account/user/nobody | base64`
   echo "VITE_NATS_NOBODY_CREDS_B64=${creds}" >> .env.local
   ```

3. Install and run: `npm install && npm run dev`

## Installation (helm-chart)

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

- `config` section with IdP details
- `ingress` section to match where appropriate.
- if relevant `vault`, `vault-actions` sections. Note if you're not using vault you'll need another method to set the `VITE_NATS_NOBODY_CREDS_B64` environment variable.

# References

- Netflix RxJS talk: https://www.youtube.com/watch?v=AslncyG8whg
- RxJS NATS library: https://github.com/captain-refactor/rx-nats
- RxJS Pokemon Deck Tutorial: https://www.youtube.com/watch?v=s6nG0byDI-o

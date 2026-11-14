# Domain and DNS

## Current state

- Address: **https://synapseatgt.github.io/website/** (GitHub's free address; no DNS to manage).
- Custom domain: **not yet decided** — see the technical proposal, §4.

## Plan

1. Email `Vanity-URLs@office365.gatech.edu` asking for `synapse.gtorg.gatech.edu` as a **CNAME to `synapseatgt.github.io`**, and whether advisor approval is needed.
2. If GT says no (or the alias can't point outside GT), buy `synapseatgt.org` **only after Institute Communications confirms in writing**, using the Synapse organisational account, club funds, auto-renew on, registrar lock on, 2FA on.

## Connecting a custom domain

1. DNS:
   - **Subdomain** (e.g. `synapse.gtorg.gatech.edu`, `www.synapseatgt.org`): a `CNAME` record pointing to `synapseatgt.github.io`.
   - **Apex** (`synapseatgt.org`): `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (check GitHub's docs for the current list), plus `www` as a CNAME.
2. Repository **Settings → Pages → Custom domain**: enter the domain, save, wait for the DNS check.
3. Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).
4. **Actions → Build and deploy → Run workflow.** The workflow reads the new URL and switches the base path from `/website` to `/` automatically; no code change is needed.
5. Verify the site on three devices, then update the URL in `README.md` and below.

(Because the workflow deploys with GitHub Actions, a `public/CNAME` file is not needed; the Settings page is the source of truth.)

## Record (keep up to date)

| Item | Value |
| --- | --- |
| Domain | _not set_ |
| Registrar / owner | _n/a_ |
| Renewal date | _n/a_ |
| Auto-renew | _n/a_ |
| DNS records | _n/a_ |
| Where the registrar login is stored | Password manager vault (see ACCOUNTS.md) |

# Troubleshooting

## "I saved, but the site didn't update"

1. Wait 5 minutes and hard-refresh (Ctrl/Cmd + Shift + R).
2. Check the entry isn't ticked **Draft**.
3. Repository → **Actions**: is the latest run red? Open it and read the failed step (see [DEPLOYMENT.md](DEPLOYMENT.md#reading-a-failed-build)). Usually a required field is empty.
4. Still stuck: message the website lead with a link to the failed run.

## "Image too large" or upload fails

Resize the photo to about 2000 px wide (any phone's "medium" export works) or under ~10 MB, then upload again.

## "My image shows as missing"

Make sure the image was uploaded through the image field (not pasted from another website). Images must live in `src/assets/uploads/`.

## "An event that already happened still shows as upcoming"

Visitors' browsers hide it automatically. If it still appears in the list, the nightly rebuild may be paused (summer): **Actions → Build and deploy → Run workflow**.

## "HTTPS error" / "Not secure" on the custom domain

Settings → Pages: check the DNS check is green and **Enforce HTTPS** is ticked. New certificates can take up to an hour. If the domain expired, see [DOMAIN-DNS.md](DOMAIN-DNS.md).

## "The form stopped receiving responses"

1. Open the form in the Synapse Google account: is it **Accepting responses**?
2. Check the response sheet is still linked (Responses tab).
3. Check the link in **Site settings** matches the form's current share link.
4. Submit a test response.

## "I can't sign in to Pages CMS / can't see the repository"

You need a GitHub account in the `editors` team of the `synapseatgt` organisation. Ask an org owner (see [ACCOUNTS.md](ACCOUNTS.md)).

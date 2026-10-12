# Make AI Work credentials

Every participant gets a credential page at `/c/<ID>` and can be checked at `/verify`.

## Adding a cohort

1. Add the records to `data/credentials/cohort-N.json` (copy the shape of `cohort-2.json`) and import the file in `lib/credentials.ts`.
2. Put each certificate-only PDF in `public/credentials/<ID>.pdf`.
3. Put each private PDF (certificate plus specification) in `public/credentials/p/<random 16 characters>.pdf` and send that link only to its owner. It is unlisted, not password-protected.
4. Remove the sample records (`"sample": true`) before the first real cohort goes live, or keep MAW-C2-000 as a public example.

The build fails if an ID is duplicated, a name or task is missing, a date is not YYYY-MM-DD, or a step label is not one of: AI assists, AI performs, Agent could run it, Stays human, Not worth changing.

## Changing a credential

- First test reported: set `outcome` to `{ "date": "YYYY-MM-DD", "text": "..." }`.
- Revoke: set `"status": "revoked"` and `revoked` to `{ "date": "YYYY-MM-DD", "reason": "..." }`. The page stays up and shows it as revoked.
- Show the specification publicly: set `"specPublic": true` (only with the participant's agreement).

Credential and verify pages are `noindex` and are not in the sitemap.

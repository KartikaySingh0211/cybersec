# TeamVault Postman vulnerability demo

Import `teamvault-vulnerability-demo.postman_collection.json` into Postman and run the collection in order.

The collection targets `https://cybersec-wr5b.onrender.com` by default. The API has no signup/register route, so the Alice demonstration begins with her seeded sign-in. It demonstrates:

- **Broken authentication (API2):** requests an Admin JWT from `/api/demo-auth/impersonate` with no credentials, then uses that token to read the Admin profile.
- **BOPLA (API3):** signs in as Alice, reads her normal `USER`/`false` role state, injects `role: ADMIN` and `isAdmin: true` through the profile PATCH, reads the escalated role, and restores Alice to `USER`/`false`.

Run the requests in order because tests save tokens as collection variables. Within the Alice flow, the reset request is setup for repeatability, then Steps 1-5 show sign-in, baseline role, escalation, post-escalation role, and cleanup. The BOPLA flow intentionally writes to the demo database during the test. Do not run this collection against a production account or database.

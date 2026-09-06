# CyberSec — Security Demonstration & Automated Remediation Target

This repository hosts **TeamVault**, an intentionally vulnerable educational multi-user document management application designed for university cybersecurity demonstrations and automated scanning & patching with **SecureLens**.

## Directory Structure
* [`teamvault/`](./teamvault/) — The full-stack target application (Express backend + Next.js App Router frontend + Mongoose models & seed scripts).
  * [`teamvault/backend/`](./teamvault/backend/) — Node.js Express API (deployable to Render)
  * [`teamvault/frontend/`](./teamvault/frontend/) — Next.js 14 Web App (deployable to Vercel)
  * [`teamvault/README.md`](./teamvault/README.md) — Comprehensive technical documentation, OWASP vulnerability walkthroughs, and deployment parameters.

⚠️ **Disclaimer: Contains intentional educational vulnerabilities (API1: BOLA, API2: Broken Auth, API3: BOPLA, API5: BFLA). For controlled academic demonstration only.**

# TeamVault — Multi-User Document Management Platform

> ⚠️ **WARNING: THIS APPLICATION CONTAINS INTENTIONAL SECURITY VULNERABILITIES FOR CONTROLLED EDUCATIONAL DEMONSTRATION ONLY.**
>
> This software is designed exclusively for university cybersecurity coursework and for validating automated vulnerability detection and patching with **SecureLens**. Never deploy this code to production or expose it publicly on the open Internet beyond academic evaluation.

---

## 1. Project Overview

**TeamVault** is a full-stack multi-user document management application. It serves as a controlled target system exhibiting exactly four deterministic OWASP API Security vulnerabilities (2023 edition):

| OWASP | Vulnerability | Demo Action | Marker in Code |
| :--- | :--- | :--- | :--- |
| **API1:2023** | **BOLA** (Broken Object Level Authorization) | Alice views Bob's confidential document | `// SECURELENS-DEMO-VULN: API1-BOLA` |
| **API2:2023** | **Broken Authentication** | Impersonation via client-controlled ID parameter | `// SECURELENS-DEMO-VULN: API2-BROKEN-AUTH` |
| **API3:2023** | **BOPLA** (Broken Object Property Level Auth) | Mass assignment escalates Alice to `ADMIN` | `// SECURELENS-DEMO-VULN: API3-BOPLA` |
| **API5:2023** | **BFLA** (Broken Function Level Authorization) | Alice accesses protected admin control plane | `// SECURELENS-DEMO-VULN: API5-BFLA` |

---

## 2. Architecture

```text
                    ┌─────────────────────────┐
                    │      Vercel / Local     │
                    │   Next.js 14 App Router │
                    │        (Port 3000)      │
                    └────────────┬────────────┘
                                 │
                                 │ HTTPS / CORS
                                 ▼
                    ┌─────────────────────────┐
                    │      Render / Local     │
                    │      Express + Node     │
                    │        (Port 5000)      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       MongoDB Atlas     │
                    │     (Users & Documents) │
                    └─────────────────────────┘
```

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs.
- **Database**: MongoDB (Atlas cluster or local).
- **Deployment**: Vercel (Frontend) & Render (Backend).

---

## 3. Pre-Seeded Deterministic Accounts & Data

Running the seed command initializes the database with predictable credentials and document ObjectIds for testing:

### Demo Users:
| Persona | Email | Password | Role | `isAdmin` | Deterministic User ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Alice** | `alice@teamvault.demo` | `Password123!` | `USER` | `false` | `66d000000000000000000001` |
| **Bob** | `bob@teamvault.demo` | `Password123!` | `USER` | `false` | `66d000000000000000000002` |
| **Admin** | `admin@teamvault.demo` | `AdminPassword123!` | `ADMIN` | `true` | `66d000000000000000000003` |

### Demo Documents:
| Document Title | Owner | Deterministic Document ID |
| :--- | :--- | :--- |
| **Alice Project Plan** | Alice | `66d100000000000000000001` |
| **Alice Personal Notes** | Alice | `66d100000000000000000002` |
| **Bob Financial Summary** (Confidential) | Bob | `66d200000000000000000001` |
| **Bob Architecture Strategy** (Internal) | Bob | `66d200000000000000000002` |

---

## 4. Local Setup & Quick Start

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm**: v9+
- **MongoDB**: MongoDB Atlas Cluster URL or local MongoDB running on `localhost:27017`

### Step 1: Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/teamvault?retryWrites=true&w=majority
JWT_SECRET=super-secret-demo-jwt-key-2025-teamvault
CLIENT_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Seed the Database
Run the seed script from the `backend/` directory:
```bash
cd backend
npm run seed
```
This drops existing collections, creates Alice, Bob, and Admin accounts with hashed passwords, inserts their documents, and prints the deterministic ID summary table.

### Step 4: Run the Backend & Frontend
In terminal 1 (Backend):
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 5. Safe Browser-Based Vulnerability Walkthroughs

### 🎯 API1: BOLA (Broken Object Level Authorization)
- **Endpoint**: `GET /api/documents/:id`
- **Vulnerability**: The controller queries document by ID without verifying `document.ownerId === req.user.id`.
- **How to demonstrate**:
  1. Sign in as **Alice** (`alice@teamvault.demo`).
  2. Visit `/documents` and open Alice's document (`/documents/66d100000000000000000001`).
  3. In the browser URL bar, change the ID to Bob's document: `/documents/66d200000000000000000001`.
  4. 🚨 **Vulnerable result**: Bob's confidential financial document renders with a live breach alert!

### 🎯 API2: Broken Authentication (Demo Route Bypass)
- **Endpoint**: `GET /api/demo-auth/impersonate?userId=<id>`
- **Vulnerability**: Insecure route directly mints a valid JWT session for any requested `userId` without credential verification.
- **How to demonstrate**:
  1. Visit `/security-demo`.
  2. Under the **API2** section, click **Bob** or **Admin** in the quick select list.
  3. Click **"Impersonate User Without Password"**.
  4. 🚨 **Vulnerable result**: The browser session immediately switches to Bob or Admin without typing any password.

### 🎯 API3: BOPLA (Broken Object Property Level Authorization)
- **Endpoint**: `PATCH /api/users/profile`
- **Vulnerability**: The controller applies `req.body` directly to `User.findByIdAndUpdate` without field allowlisting, enabling mass assignment.
- **How to demonstrate**:
  1. Sign in as normal user **Alice** (`role: USER`, `isAdmin: false`).
  2. Notice Alice cannot see the "Admin" navigation link.
  3. Visit `/security-demo` under **API3**.
  4. Select `role = ADMIN` and check `isAdmin = true`.
  5. Click **"Inject Protected Properties (PATCH)"**.
  6. 🚨 **Vulnerable result**: The backend updates Alice's account to `ADMIN`. Alice now sees the Admin portal!

### 🎯 API5: BFLA (Broken Function Level Authorization)
- **Endpoints**: `GET /api/admin/users`, `GET /api/admin/statistics`
- **Vulnerability**: Backend verifies JWT token presence, but never validates `req.user.role === 'ADMIN'`.
- **How to demonstrate**:
  1. Sign in as standard user **Alice** (`role: USER`).
  2. In the browser URL bar, manually navigate directly to `/admin`.
  3. 🚨 **Vulnerable result**: The admin dashboard loads, showing total system statistics and all registered users!

---

## 6. Cloud Deployment Guide (Render & Vercel)

### Backend Deployment on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `teamvault/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables** in Render Dashboard:

```text
PORT = 10000
MONGODB_URI = <YOUR_MONGODB_ATLAS_CONNECTION_STRING>
JWT_SECRET = super-secret-demo-jwt-key-2025-teamvault
CLIENT_URL = https://<your-vercel-frontend-domain>.vercel.app
```

> **Database Seeding on Render**:
> In Render's Web Shell or locally against the MongoDB URI:
> `npm run seed`

---

### Frontend Deployment on Vercel

1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Configure project settings:
   - **Root Directory**: `teamvault/frontend`
   - **Framework Preset**: `Next.js`
4. Add the following **Environment Variable** in Vercel Project Settings:

```text
NEXT_PUBLIC_API_URL = https://<your-render-backend-name>.onrender.com
```

---

## 7. SecureLens Automated Remediation Workflow

When ready to test SecureLens:
1. Run local / remote scans against this repository.
2. SecureLens flags the 4 vulnerability markers and AST patterns:
   - `// SECURELENS-DEMO-VULN: API1-BOLA`
   - `// SECURELENS-DEMO-VULN: API2-BROKEN-AUTH`
   - `// SECURELENS-DEMO-VULN: API3-BOPLA`
   - `// SECURELENS-DEMO-VULN: API5-BFLA`
3. SecureLens generates AST-safe patches:
   - Adding `ownerId: req.user.id` check to document controller.
   - Decommissioning demo impersonation bypass or enforcing auth guards.
   - Adding allowlisting (`{ name: req.body.name, email: req.body.email }`) on profile updates.
   - Adding role authorization middleware `requireAdmin` (`req.user.role === 'ADMIN'`).
4. Approving the patch creates a git diff, runs tests, commits, and pushes.
5. Vercel & Render redeploy automatically, blocking the exploits on subsequent browser tests!

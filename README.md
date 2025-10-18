# SMM Monorepo Setup

Welcome! This monorepo uses [Turborepo](https://turborepo.com/) to manage both frontend and backend codebases. Please follow the instructions below to set up your environment and run the project.

---

## Required Setup Steps

**Complete each marked step (`[x]`) to ensure the project runs successfully.**

### 1. **Install Dependencies** `[x]`

At the repo root, install all packages using:

```sh
yarn install
```

- This will install all dependencies for both frontend and backend using workspaces.

---

### 2. **Backend Setup** `[x]`

Navigate to the backend package:

```sh
cd packages/backend
```

#### a. **Copy and Configure Environment Variables** `[x]`

```sh
cp env.template .env
```

Edit `.env` and replace placeholder values. **You must set:**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- Optionally: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ENCRYPTION_KEY`, `SESSION_SECRET`, `FRONTEND_URL`

#### b. **Start MongoDB** `[x]`

- Ensure [MongoDB](https://www.mongodb.com/) is running locally (`mongod`)  
  **OR**  
  Set your MONGODB_URI to a [MongoDB Atlas](https://www.mongodb.com/atlas/database) cluster.

---

### 3. **Frontend Setup** `[x]`

Navigate back to the repo root:

```sh
cd ../../
```

The frontend is inside `packages/frontend`. No extra config is required unless specified in its README.

---

### 4. **Generate Secure Keys** (Highly recommended for production) `[x]`

If deploying to production, generate secure secrets:

```sh
# 32+ char JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# 32 char encryption key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste these in your backend `.env`.

---

## Running the Project

From the **repo root**:

### 5. **Build the Repo** `[optional unless deploying]`

```sh
yarn build
```

---

### 6. **Start Development Servers** `[x]`

```sh
yarn dev
```

- This will run both frontend and backend servers in dev mode.

---

## About This Monorepo

- **packages/frontend**: Next.js frontend app
- **packages/backend**: Node.js backend with Google OAuth & MongoDB
- **(other common packages may exist as utilities/config)**

Monorepo managed tools:

- **TypeScript** for type checking
- **ESLint** for linting
- **Prettier** for formatting
- **Turbo** for build orchestration

---

## Authentication Flow (Backend)

1. User hits `/auth/google`, gets redirected to Google
2. On callback, backend exchanges code for tokens and generates JWT
3. JWT is passed to frontend for protected routes

---

## Useful Commands

- `yarn dev` – start all dev servers
- `yarn build` – build all apps/packages
- `yarn lint` – run linters
- `yarn format` – run Prettier

---

## More Info

- See [packages/backend/SETUP.md](packages/backend/SETUP.md) for detailed backend instructions.
- Turborepo docs: [Running Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks), [Caching](https://turborepo.com/docs/core-concepts/remote-caching)

---

## Checklist for Setup

- [ ] Install root dependencies
- [ ] Configure backend `.env`
- [ ] Start MongoDB (local or Atlas)
- [ ] Generate and add secrets to `.env` (for prod)
- [ ] Start dev servers with `yarn dev`

_Complete all steps marked `[x]` before using the project._

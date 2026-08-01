# Synalytix Backend API

Node.js + TypeScript backend for Synalytix. Handles OAuth flows for GitHub,
Instagram, X (Twitter), and LinkedIn. Also queries LeetCode's public API.
All tokens are encrypted and stored in Supabase.

---

## Architecture Overview

```
Frontend (React)
    │
    │  Authorization header: Bearer <supabase_jwt>
    ▼
Synalytix Backend (this repo)  ←→  Supabase (PostgreSQL)
    │
    ├── /api/auth/connect/:platform   → redirects user to platform login
    ├── /api/auth/callback/:platform  → receives code, exchanges for token
    ├── /api/auth/disconnect/:platform → removes token from DB
    ├── /api/auth/status              → which platforms are connected
    ├── /api/data/summary             → all platforms in one call
    ├── /api/data/github/*
    ├── /api/data/instagram/*
    ├── /api/data/x/*
    ├── /api/data/linkedin/*
    └── /api/data/leetcode/*
```

---

## STEP 1 — Set up Supabase

### 1a. Create a Supabase project

1. Go to https://supabase.com and sign up (free)
2. Click "New project"
3. Name it "synalytix"
4. Choose a region close to your users (e.g., ap-south-1 for India)
5. Set a strong database password — save it somewhere
6. Wait ~2 minutes for the project to provision

### 1b. Get your credentials

In your Supabase dashboard:

1. Go to **Settings → API**
2. Copy these three values:
   - **Project URL** → goes into `SUPABASE_URL`
   - **anon public key** → goes into `SUPABASE_ANON_KEY`
   - **service_role secret key** → goes into `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → API → JWT Settings**
4. Copy the **JWT Secret** → goes into `JWT_SECRET`

> ⚠️ The service_role key bypasses Row Level Security. NEVER expose it to the frontend.

### 1c. Run the database migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Open the file `supabase/migrations/001_initial_schema.sql`
4. Paste the entire contents into the SQL editor
5. Click **Run**
6. You should see 4 tables created: `platform_connections`, `oauth_states`, `api_cache`, `user_profiles`

### 1d. Enable authentication providers in Supabase

For your frontend login (not for platform OAuth — that goes through your backend):

1. Go to **Authentication → Providers**
2. Enable **Email** (for email/password login)
3. Optionally enable **Google** or **GitHub** for social login on your frontend

---

## STEP 2 — Create Developer Apps on Each Platform

Use `BACKEND_URL` for every callback URL and `FRONTEND_URL` for every homepage or website URL. For local development in this repo, the default values are:

- Frontend URL: `http://localhost:3000`
- Backend URL: `http://localhost:4000`

### GitHub
1. Go to https://github.com/settings/developers
2. Click **OAuth Apps → New OAuth App**
3. Fill in:
   - Application name: `Synalytix`
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:4000/api/auth/callback/github`
4. Click Register application
5. Copy **Client ID** → `GITHUB_CLIENT_ID`
6. Click **Generate a new client secret** → `GITHUB_CLIENT_SECRET`

### Instagram / Meta
1. Go to https://developers.facebook.com
2. Click **My Apps → Create App**
3. Select **Business** as the app type
4. Name it `Synalytix`
5. Add the **Facebook Login** product
6. Go to **Facebook Login → Settings**
7. Add to **Valid OAuth Redirect URIs**: `http://localhost:4000/api/auth/callback/instagram`
8. Go to **App Settings → Basic**
9. Copy **App ID** → `META_APP_ID`
10. Copy **App Secret** → `META_APP_SECRET`
11. Request or test with these permissions: `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`

> ⚠️ For Instagram Insights, the user's Instagram must be a **Professional account**
> (Creator or Business) connected to a **Facebook Page**.
>
> In development, you can only test with accounts listed as **Test Users** in your
> Meta app (Roles → Test Users). For production, submit your app for Meta App Review.

### X (Twitter)
1. Go to https://developer.twitter.com
2. Apply for a developer account (free)
3. Create a **Project** then an **App** inside it
4. Go to **User authentication settings**
5. Enable **OAuth 2.0**
6. Set Type of App to **Web App**
7. Callback URI: `http://localhost:4000/api/auth/callback/x`
8. Website URL: `http://localhost:3000`
9. Enable PKCE / code challenge if shown. The backend already sends the S256 code challenge.
10. Set app permissions to **Read and Write** if publishing is needed, or **Read** for analytics-only access
11. Copy **Client ID** → `X_CLIENT_ID`
12. Copy **Client Secret** → `X_CLIENT_SECRET`

> ⚠️ The free tier gives very limited analytics. `impression_count` requires
> the Basic plan ($100/month). Basic engagement (likes, retweets) is free.

### LinkedIn
1. Go to https://linkedin.com/developers
2. Click **Create App**
3. Fill in company name (required — create a LinkedIn Company Page first)
4. Go to **Auth** tab
5. Add redirect URL: `http://localhost:4000/api/auth/callback/linkedin`
6. Go to **Products** tab, request access to **Sign In with LinkedIn using OpenID Connect**
7. Copy **Client ID** → `LINKEDIN_CLIENT_ID`
8. Copy **Client Secret** → `LINKEDIN_CLIENT_SECRET`

> ⚠️ Full post analytics on LinkedIn requires the **Marketing Developer Platform**
> product, which requires applying and LinkedIn approval. Basic profile data works immediately.

### LeetCode
No developer account needed. LeetCode has no official OAuth.
Users just enter their username and we query the public GraphQL API.

---

## STEP 3 — Configure Environment Variables

```bash
# In the project root:
cp .env.example .env
```

Open `.env` and fill in every value. Example:

```env
PORT=4000
NODE_ENV=development

SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
JWT_SECRET=your-supabase-jwt-secret-from-dashboard

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6

GITHUB_CLIENT_ID=Iv1.abc123
GITHUB_CLIENT_SECRET=abc123def456...

META_APP_ID=1234567890
META_APP_SECRET=abc123...

X_CLIENT_ID=abc123...
X_CLIENT_SECRET=abc123...

LINKEDIN_CLIENT_ID=abc123...
LINKEDIN_CLIENT_SECRET=abc123...

GOOGLE_CLIENT_ID=abc123...
GOOGLE_CLIENT_SECRET=abc123...
```

---

## STEP 4 — Install & Run

```bash
# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

You should see:
```
  ╔═══════════════════════════════════════╗
  ║       Synalytix Backend API           ║
  ╚═══════════════════════════════════════╝

  🚀  Server running on http://localhost:4000
  🌍  Environment: development
```

Test the health endpoint:
```bash
curl http://localhost:4000/health
```

---

## STEP 5 — Connect to Your Frontend

In your React frontend (Synalytix), here is exactly how to call this backend:

### 5a. Install the Supabase client

```bash
npm install @supabase/supabase-js
```

### 5b. Create a Supabase client in your frontend

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY  // anon key is safe in frontend
);
```

Add to your frontend `.env`:
```
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_BACKEND_URL=http://localhost:4000
```

### 5c. Create an API client helper

```typescript
// src/lib/api.ts
import { supabase } from './supabase';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error('Not authenticated');

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Connect a platform — redirects browser to platform OAuth page
export function connectPlatform(platform: string) {
  // We can't use fetch here because we need a full browser redirect
  // So we navigate to the backend URL directly
  window.location.href = `${BACKEND}/api/auth/connect/${platform}`;
  
  // But first we need to pass the auth token...
  // Solution: store the session token in a short-lived cookie OR
  // append it as a query param that the backend reads:
  // window.location.href = `${BACKEND}/api/auth/connect/${platform}?token=${token}`;
}

// Get connection status
export async function getConnectionStatus() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/status`, { headers });
  return res.json();
}

// Disconnect a platform
export async function disconnectPlatform(platform: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/auth/disconnect/${platform}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

// Get all platform data at once (for dashboard)
export async function getDashboardSummary() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/summary`, { headers });
  return res.json();
}

// Platform-specific fetchers
export async function getGitHubData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/github/all`, { headers });
  return res.json();
}

export async function getInstagramData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/instagram/all`, { headers });
  return res.json();
}

export async function getXData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/x/all`, { headers });
  return res.json();
}

export async function getLeetCodeData() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/leetcode/all`, { headers });
  return res.json();
}

// Connect LeetCode (special — just username, no OAuth)
export async function connectLeetCode(username: string) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND}/api/data/leetcode/connect`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username }),
  });
  return res.json();
}
```

### 5d. Handle the OAuth redirect for connect

The connect flow needs to pass the user's JWT to the backend BEFORE redirecting.
Here is the pattern to handle this:

```typescript
// In your AppsList.tsx or wherever "Connect" button is

import { supabase } from '../lib/supabase';

async function handleConnect(platform: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    // User is not logged in
    navigate('/auth');
    return;
  }

  // Pass token as query param so backend can authenticate the request
  // (This is safe because it's HTTPS and the token is short-lived)
  window.location.href =
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/connect/${platform}?token=${token}`;
}
```

Then update the backend connect route to also accept token from query param:

```typescript
// In src/routes/auth.ts — update authenticate for connect routes
// The /connect route can't use the Authorization header because it's a browser redirect
// So we accept the token from query param instead:

router.get('/connect/:platform', async (req, res) => {
  const token = req.query.token as string || req.headers.authorization?.split(' ')[1];
  // verify token, get userId...
```

### 5e. Handle the callback redirect

After successful OAuth, the backend redirects to:
`http://localhost:3000/app/apps/github?connected=true`

In your frontend, detect this and show a success message:
```typescript
// In AppDetails.tsx or AppsList.tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('connected') === 'true') {
    showToast(`Platform connected successfully!`);
    // Refresh connection status
    loadConnectionStatus();
  }
  if (params.get('error')) {
    showToast(`Connection failed: ${params.get('error')}`, 'error');
  }
}, []);
```

---

## STEP 6 — Deploy to Production

### Backend: Railway (recommended)

1. Push this project to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub repo
3. Select this repo
4. Railway auto-detects Node.js and runs `npm start`
5. Go to **Variables** and add all your `.env` variables
6. Railway gives you a URL like `https://synalytix-backend.up.railway.app`
7. Update `BACKEND_URL` in your env to this URL
8. Update all OAuth callback URLs in each platform's developer console to use this URL

### Alternative: Render
1. https://render.com → New Web Service → Connect GitHub
2. Build command: `npm run build`
3. Start command: `npm start`
4. Same process for environment variables

### Update OAuth Callback URLs for Production

In each platform's developer console, add your production callback URL:
```
GitHub:    https://your-backend.railway.app/api/auth/callback/github
Instagram: https://your-backend.railway.app/api/auth/callback/instagram
X:         https://your-backend.railway.app/api/auth/callback/x
LinkedIn:  https://your-backend.railway.app/api/auth/callback/linkedin
```

---

## API Reference

All protected routes require: `Authorization: Bearer <supabase_access_token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/auth/connect/:platform` | Start OAuth flow |
| GET | `/api/auth/callback/:platform` | OAuth callback (called by platform) |
| DELETE | `/api/auth/disconnect/:platform` | Remove a connection |
| GET | `/api/auth/status` | List connected platforms |
| GET | `/api/data/summary` | All platforms summary |
| GET | `/api/data/github/all` | GitHub profile + repos + contributions |
| GET | `/api/data/github/profile` | GitHub profile only |
| GET | `/api/data/github/repos` | GitHub repositories |
| GET | `/api/data/github/contributions` | Contribution activity |
| GET | `/api/data/instagram/all` | Instagram profile + insights + media |
| GET | `/api/data/instagram/profile` | Instagram profile |
| GET | `/api/data/instagram/insights` | Account-level insights |
| GET | `/api/data/instagram/media` | Posts with engagement |
| GET | `/api/data/x/all` | X profile + tweets |
| GET | `/api/data/x/profile` | X profile |
| GET | `/api/data/x/tweets` | Recent tweets with metrics |
| GET | `/api/data/linkedin/all` | LinkedIn profile + posts |
| GET | `/api/data/linkedin/profile` | LinkedIn profile |
| GET | `/api/data/leetcode/all` | LeetCode stats + submissions |
| GET | `/api/data/leetcode/stats` | LeetCode problem stats |
| GET | `/api/data/leetcode/submissions` | Recent submissions |
| POST | `/api/data/leetcode/connect` | Connect LeetCode by username |
| POST | `/api/data/cache/invalidate/:platform` | Force fresh data |

---

## Common Issues & Fixes

**"SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"**
→ Your `.env` file is missing or not being loaded. Ensure `.env` is in the project root.

**"Invalid or expired state token"**
→ The OAuth flow took more than 10 minutes, or the state was already used.
Try connecting again.

**"No Instagram Business/Creator account found"**
→ The user's Instagram is a personal account. They need to switch to a Professional
account in Instagram Settings → Account → Switch to Professional Account.

**CORS errors in browser**
→ Your frontend URL is not in the `FRONTEND_URL` env variable. Check it matches exactly.

**LeetCode "user not found"**
→ The GraphQL endpoint may be temporarily down, or the username is wrong.
Test with: `curl -X POST https://leetcode.com/graphql -H "Content-Type: application/json" -d '{"query":"{ matchedUser(username: \"YOUR_USERNAME\") { username } }"}'`

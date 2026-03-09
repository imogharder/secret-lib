# 🏛️ Secret Library

A premium private knowledge library with Google Auth, role-based access, unlimited niches, and custom tags.

---

## 📦 Tech Stack

| Layer     | Tech                |
|-----------|---------------------|
| Frontend  | React 18 + Vite     |
| Auth      | Firebase Auth       |
| Database  | Firestore           |
| Styling   | Custom CSS (Space Grotesk + Cormorant Garamond) |
| Hosting   | Netlify             |

---

## 🚀 Setup Guide

### Step 1 — Clone & Install

```bash
git clone https://github.com/imogharder/secret-lib.git
cd secret-lib
npm install
```

---

### Step 2 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `secret-lib` → continue
3. Disable Google Analytics (optional) → **Create project**

#### Enable Authentication
1. Left sidebar → **Build → Authentication**
2. Click **Get started**
3. **Sign-in method** tab → Enable:
   - **Google** → toggle on → add your support email → Save
   - **Email/Password** → toggle on → Save

#### Create Firestore Database
1. Left sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** → Next
4. Select your region (closest to you) → **Enable**

#### Deploy Security Rules
1. In Firestore → **Rules** tab
2. Copy the contents of `firestore.rules` from this project
3. Paste and click **Publish**

---

### Step 3 — Get Your Firebase Config

1. Firebase Console → ⚙️ **Project Settings** (gear icon, top left)
2. Scroll to **Your apps** → click **</>** (Web app) → Register app → name it → Continue
3. You'll see a `firebaseConfig` object. Copy all the values.

---

### Step 4 — Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=secret-lib-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=secret-lib-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=secret-lib-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

---

### Step 5 — Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### Step 6 — Make Yourself Admin

1. Go to your running site and **sign in with your Google account** (or register)
2. You'll land on the `/pending` page — that's expected
3. Go to [Firebase Console → Firestore](https://console.firebase.google.com) → `users` collection
4. Find your user document (it's your Firebase UID)
5. Click the document → Edit the `role` field → change `"pending"` to `"admin"`
6. Refresh the site → you now have full admin access ⚡

---

### Step 7 — Deploy to Netlify

#### Option A — Netlify UI (easiest)
1. Push your code to GitHub: `git push origin main`
2. Go to [https://netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Connect GitHub → Select `secret-lib` repo
4. Build settings are auto-detected via `netlify.toml`
5. **Important:** Go to **Site settings → Environment variables**
6. Add all 6 `VITE_FIREBASE_*` variables from your `.env`
7. Click **Deploy site** ✅

#### Option B — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_FIREBASE_API_KEY "your-value"
# ... repeat for all 6 vars
netlify deploy --prod
```

---

## 🔐 How Access Control Works

| Role      | Can Do                                          |
|-----------|-------------------------------------------------|
| `pending` | Nothing — sees waiting page only               |
| `member`  | Read library, create/edit own entries          |
| `admin`   | Everything — manage users, niches, tags, all entries |

**Flow:**
1. User registers (Google or email)
2. Account created with `pending` role
3. **Admin approves** in `/admin/users` → role becomes `member`
4. User can now access the library

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── firebase.js          # Firebase init
│   └── db.js                # All Firestore operations
├── contexts/
│   └── AuthContext.jsx      # Auth state + helpers
├── hooks/
│   └── useToast.js
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── PendingPage.jsx
│   ├── library/             # Main library UI
│   │   ├── LibraryPage.jsx
│   │   ├── NicheBar.jsx
│   │   ├── CategorySection.jsx
│   │   ├── EntryCard.jsx
│   │   ├── EntryDetail.jsx
│   │   ├── EntryEditor.jsx
│   │   ├── CategoryEditor.jsx
│   │   ├── SearchBar.jsx
│   │   └── ColorPicker.jsx
│   └── admin/               # Admin panel
│       ├── AdminLayout.jsx
│       ├── AdminDashboard.jsx
│       ├── UserManagement.jsx
│       ├── NicheManager.jsx
│       ├── TagManager.jsx
│       └── EntryManager.jsx
```

---

## ✨ Features

- 🔐 **Google OAuth + Email/Password** sign-in
- ✅ **Admin approval** — you approve every user
- ♾️ **Unlimited niches** with custom icons + hex colors
- 🏷️ **Custom tags** with full color picker (presets + custom hex)
- 📝 **3 content types**: Note, Link, Post
- 🔍 **Live search** across all entries
- 📊 **Admin dashboard** — users, niches, tags, entries
- 🎨 **Premium dark design** — Cormorant Garamond + Space Grotesk
- ⚡ **Real-time** — Firestore live listeners
- 🆓 **100% free** — Firebase Spark + Netlify free tier

---

## 🆓 Free Tier Limits (More Than Enough)

| Service   | Limit                              |
|-----------|------------------------------------|
| Firebase Auth | Unlimited sign-ins           |
| Firestore | 1GB storage, 50k reads/day, 20k writes/day |
| Netlify   | 100GB bandwidth/month, unlimited deploys |

---

## 💡 Adding Content from Old Site

Your old `knowledge.git` data is stored in `localStorage`. To migrate:
1. Open your old site in a browser
2. Open DevTools → Console
3. Run: `console.log(JSON.stringify(localStorage.getItem('kc_data')))`
4. Copy the data and use the new **admin entry editor** to re-create entries
   (or ask for a migration script if you have lots of content)

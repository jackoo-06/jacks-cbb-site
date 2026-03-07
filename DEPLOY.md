# Jack's CBB — Deployment Guide

## What's In This Folder

```
jacks-cbb-site/
├── index.html              ← HTML entry point
├── package.json            ← Dependencies (React, Recharts, Vite)
├── vite.config.js          ← Build config
├── export_to_site.py       ← Your data export script
├── .gitignore
├── public/
│   └── data/
│       ├── projections.json   ← From your Projections tab
│       ├── rankings.json      ← From your Rankings tab
│       ├── bracket.json       ← From your MMSim tab
│       └── record.json        ← From your Record tab
└── src/
    ├── main.jsx            ← React entry
    └── App.jsx             ← The entire website
```

---

## Step 1: Install Git (if you don't have it)

**Mac:**
```bash
# Open Terminal and run:
xcode-select --install
```

**Windows:**
Download from https://git-scm.com/download/win

Verify it works:
```bash
git --version
```

---

## Step 2: Install Node.js (if you don't have it)

Download from https://nodejs.org (get the LTS version)

Verify:
```bash
node --version
npm --version
```

---

## Step 3: Create a GitHub Account & Repository

1. Go to https://github.com and sign up (free)
2. Click the **+** in the top right → **New repository**
3. Name it: `jacks-cbb-site`
4. Keep it **Public** (required for free Vercel)
5. Do NOT initialize with README (we'll push our own files)
6. Click **Create repository**
7. Keep this page open — you'll need the URL it shows

---

## Step 4: Push Your Code to GitHub

Open your terminal/command prompt and run these commands one at a time.

**First, navigate to where you saved the jacks-cbb-site folder:**
```bash
cd /path/to/jacks-cbb-site
```

**Initialize git and push:**
```bash
git init
git add .
git commit -m "Initial commit - Jack's CBB site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jacks-cbb-site.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

If prompted for credentials, use your GitHub username and a **Personal Access Token** 
(not your password). Create one at: https://github.com/settings/tokens → Generate new token → select "repo" scope.

---

## Step 5: Deploy to Vercel

1. Go to https://vercel.com
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New...** → **Project**
5. Find `jacks-cbb-site` in the list and click **Import**
6. Vercel auto-detects it's a Vite project — **don't change any settings**
7. Click **Deploy**
8. Wait ~60 seconds — your site is live!

Your URL will be something like: `https://jacks-cbb-site.vercel.app`

---

## Step 6: Set Up Your Daily Workflow

### Option A: Manual push (simplest)

After updating your WebsiteData.xlsx:

```bash
# 1. Copy your WebsiteData.xlsx into the jacks-cbb-site folder

# 2. Run the export script
python export_to_site.py

# 3. Push to GitHub (triggers auto-deploy on Vercel)
git add .
git commit -m "Update data"
git push
```

Your site updates in ~30 seconds after the push.

### Option B: Auto-push (one-time setup)

Update `export_to_site.py` — set `GITHUB_REPO_DIR`:

```python
GITHUB_REPO_DIR = "/path/to/jacks-cbb-site"
```

Now just run:
```bash
python export_to_site.py
```

And it exports + pushes in one step.

### Option C: One-click script

Create a file called `update.sh` (Mac) or `update.bat` (Windows):

**Mac (update.sh):**
```bash
#!/bin/bash
cd /path/to/jacks-cbb-site
cp /path/to/your/WebsiteData.xlsx .
python3 export_to_site.py
git add .
git commit -m "Update data - $(date '+%b %d %Y %I:%M %p')"
git push
echo "✅ Site updated!"
```

Make it executable: `chmod +x update.sh`
Run it: `./update.sh`

**Windows (update.bat):**
```batch
@echo off
cd C:\path\to\jacks-cbb-site
copy "C:\path\to\your\WebsiteData.xlsx" .
python export_to_site.py
git add .
git commit -m "Update data"
git push
echo Site updated!
pause
```

Double-click to run.

---

## Custom Domain (Optional)

If you want a custom domain like `jackscbb.com`:

1. Buy a domain from Namecheap, Google Domains, etc. (~$10/year)
2. In Vercel dashboard → your project → Settings → Domains
3. Add your domain
4. Update your DNS records as Vercel instructs (usually just 2 records)
5. HTTPS is automatic

---

## Editing the Site

The entire website is in `src/App.jsx`. To make changes:

1. Edit the file
2. Push to GitHub
3. Vercel auto-deploys

**To edit Writing/Portfolio content:** Search for `const ARTICLES` or `const PORTFOLIO` in App.jsx and follow the comment templates.

**To edit the About page:** Search for `function About()` in App.jsx.

**To test locally before pushing:**
```bash
npm install      # first time only
npm run dev      # starts local server at http://localhost:5173
```

---

## Troubleshooting

**"npm not found"** → Install Node.js from https://nodejs.org

**"git not found"** → Install Git (see Step 1)

**Vercel build fails** → Check that package.json and vite.config.js are in the root of your repo

**Data not updating** → Make sure JSON files are in `public/data/` and you pushed to GitHub

**Export script fails** → Run `pip install openpyxl` and check that WebsiteData.xlsx is in the same folder

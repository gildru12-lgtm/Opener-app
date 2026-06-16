# 💘 First Line Generator — Deployment Guide

## What you need before starting
- A GitHub account (you already have this ✅)
- A free Vercel account → sign up at vercel.com using your GitHub
- An Anthropic API key → get one at console.anthropic.com

---

## Step 1 — Upload to GitHub

1. Go to **github.com** and log in
2. Click the **+** button (top right) → **New repository**
3. Name it: `opener-app`
4. Make sure it's set to **Public**
5. Click **Create repository**
6. On the next page, click **uploading an existing file**
7. Drag and drop the entire `opener-app` folder contents into the page
8. Click **Commit changes**

---

## Step 2 — Deploy on Vercel

1. Go to **vercel.com** → click **Sign Up** → choose **Continue with GitHub**
2. Click **Add New Project**
3. Find your `opener-app` repository and click **Import**
4. Leave all settings as default
5. Click **Deploy**
6. Wait ~1 minute — Vercel builds your app automatically

---

## Step 3 — Add your API Key (IMPORTANT)

Without this step the app won't work.

1. In Vercel, go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key (starts with `sk-ant-...`)
4. Click **Save**
5. Go back to **Deployments** → click the three dots on your latest deployment → **Redeploy**

---

## Step 4 — Your app is live! 🎉

Vercel gives you a URL like: `https://opener-app-xyz.vercel.app`

Share it anywhere — WhatsApp, Instagram, TikTok, wherever!

---

## Need help?
Every time you make changes to the code and push to GitHub, Vercel automatically redeploys. No manual work needed.

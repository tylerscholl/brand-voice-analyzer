# Brand Voice Analyzer — Deploy Guide

A step-by-step guide to get your Brand Voice Analyzer live on the internet. No engineering experience needed.

---

## What you'll end up with
- A live URL anyone can visit (e.g., `brand-voice-analyzer.vercel.app`)
- Your own custom domain if you want one (e.g., `voiceaudit.xyz`)
- A tool you can share on LinkedIn, in DMs, or embed on your portfolio

---

## Step 1: Get an Anthropic API Key

This is what lets the tool call Claude to analyze websites.

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an account (or sign in)
3. Go to **API Keys** in the sidebar
4. Click **Create Key**
5. Copy the key — it starts with `sk-ant-...`
6. Save it somewhere safe (you'll need it in Step 4)

**Cost:** You get $5 free credit. Each analysis costs ~$0.01–0.03. That's hundreds of analyses before you'd ever pay anything.

---

## Step 2: Create a GitHub Account & Repository

GitHub is where your code lives. Vercel reads from it.

1. Go to [github.com](https://github.com) and create a free account (or sign in)
2. Click the **+** icon (top right) → **New repository**
3. Name it `brand-voice-analyzer`
4. Keep it **Public** (or Private, both work with Vercel)
5. Check **"Add a README file"**
6. Click **Create repository**

### Upload the project files

1. In your new repo, click **"Add file"** → **"Upload files"**
2. Drag the entire contents of the `brand-voice-analyzer` folder:
   - `package.json`
   - `next.config.js`
   - `.gitignore`
   - `.env.example`
   - `app/` folder (containing `layout.js`, `page.js`, and `api/analyze/route.js`)
3. Click **"Commit changes"**

Your repo should look like:
```
brand-voice-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js      ← Server-side API (keeps your key safe)
│   ├── layout.js              ← HTML wrapper + fonts + SEO metadata
│   └── page.js                ← The full analyzer UI
├── .env.example
├── .gitignore
├── next.config.js
└── package.json
```

---

## Step 3: Connect Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. You'll see your GitHub repos — select `brand-voice-analyzer`
4. Vercel auto-detects it's a Next.js project. Leave all settings as default.
5. **Before clicking Deploy** → expand **"Environment Variables"**

---

## Step 4: Add Your API Key

In the Environment Variables section:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-your-key-here` (paste your real key from Step 1) |

Click **"Add"**, then click **"Deploy"**.

---

## Step 5: Wait ~60 seconds

Vercel builds and deploys your project. When it's done, you'll see:

✅ **Your live URL**: `brand-voice-analyzer.vercel.app`

Click it. Your Brand Voice Analyzer is live on the internet.

---

## Step 6 (Optional): Custom Domain

1. Buy a domain (Namecheap, Google Domains, Cloudflare — ~$10/year)
   - Ideas: `voiceaudit.xyz`, `brandvoice.tools`, `analyze.beyondthecreative.xyz`
2. In Vercel, go to your project → **Settings** → **Domains**
3. Add your custom domain
4. Vercel gives you DNS records to add at your domain registrar
5. Wait 5-10 minutes for DNS to propagate

---

## Sharing on LinkedIn

Once it's live, post something like:

> **I vibe coded a Brand Voice Analyzer this weekend.**
>
> Paste any URL → get an instant AI audit of tone, clarity, differentiation, 
> audience fit, and emotional resonance. Scored against a defined rubric.
>
> Try it: [your-url-here]
>
> Built with Claude. Designed, concepted, and directed by me.
> No engineering team. Just design thinking + AI.
>
> This is what "AI-native design" looks like in practice.

---

## Updating the Tool

When you want to make changes:
1. Edit the files on GitHub (or locally with `git`)
2. Push/commit the changes
3. Vercel automatically redeploys in ~30 seconds

---

## Troubleshooting

**"Build failed" on Vercel:**
- Make sure the folder structure matches exactly (especially `app/api/analyze/route.js`)
- Check that `package.json` is in the root, not nested in a subfolder

**Analysis returns errors:**
- Check that your `ANTHROPIC_API_KEY` is set correctly in Vercel → Settings → Environment Variables
- Make sure the key starts with `sk-ant-`

**Site loads but looks broken:**
- Clear your browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Check the browser console (F12) for error messages

---

## What This Project Demonstrates

When sharing this with people like Elias Torres or in job conversations:

- **Product thinking:** You identified a use case, defined a rubric, and built a complete tool
- **AI-native workflow:** You directed the build using natural language, not traditional coding
- **Design + engineering:** The UI is polished, the UX is considered, the architecture is sound
- **Ship speed:** Concept to live product in a single session

This is the "new age work" that demonstrates you operate in 2026, not 2024.

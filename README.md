# Will you go on a date with me? — Emily

A small, personal site with one job: ask Emily out, in a way that's a bit more
fun than a text.

## What it does

- Opens on a question with her name and a "yes" / "no" choice.
- The "no" button physically dodges the cursor (or finger, on mobile) and
  eventually starts throwing charming fake error messages instead of letting
  itself be pressed.
- "Yes" opens a small form: pick a date, optionally say where she'd like to
  go, optionally leave a note.
- On submit, the answer is:
  - emailed to you (via Resend), and
  - saved so you can check it later at `/results` with a secret key.

## Before you deploy

1. **Get a free Resend API key** at resend.com (no card needed). Resend is
   how the email actually gets sent.
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `RESEND_API_KEY` — from Resend.
   - `RESEND_FROM_EMAIL` — you can leave this as `onboarding@resend.dev` to
     start (Resend's shared sending address, works without verifying a
     domain). If you verify your own domain in Resend later, switch this to
     an address on that domain.
   - `NOTIFY_EMAIL` — your real email address, where her answer should land.
   - `RESULTS_KEY` — any password you make up. This is what protects
     `/results` so only you can see submissions there.
3. If editing for someone other than Emily, change `RECIPIENT_NAME` in
   `app/page.tsx`.

## Running locally

npm install
npm run dev

Visit http://localhost:3000.

## Deploying to Vercel

vercel

Then in the Vercel project dashboard, add the same environment variables
from `.env.local` under Settings -> Environment Variables, and redeploy.

### A note on persistence

The "saved so you can check later" part writes to a JSON file. That works
locally, but Vercel's serverless functions don't have a writable, persistent
filesystem between requests, so on Vercel, email is the reliable record.
The /results page will only show submissions made during the same
serverless instance's lifetime, which isn't guaranteed. If you want
/results to be fully reliable in production, the next step would be wiring
up a small database (Vercel Postgres or Vercel KV both work well here) —
happy to do that next if you want it.

## Checking results

Visit /results, enter the RESULTS_KEY you set, and it'll show any
submissions it has on hand. The email is the dependable copy.

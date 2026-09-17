# Creative CV

Premium Next.js rebuild of the Creative CV product (South African CV writing, job board, and CV generator). Editorial redesign — not a pixel clone of [creative-cv.co.za](https://www.creative-cv.co.za/).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env.local`. None of the keys are required for the public UI, job board seed data, or order/contact forms.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (Paystack callbacks) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; do not expose to the browser |
| `PAYSTACK_SECRET_KEY` | ZAR checkout for packages and generator PDF |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Optional Paystack public key |
| `RESEND_API_KEY` | Contact and order emails |
| `CONTACT_TO_EMAIL` | Defaults to  info@creative-cv.co.za |
| `BLOB_READ_WRITE_TOKEN` | Optional Vercel Blob uploads |

Without Paystack keys, order and generator checkout still submit to the API and explain that payment is not configured. They never pretend a charge succeeded.

Without Supabase, auth uses a local session cookie so dashboards work, and the job board uses 16 seeded South African roles.

Apply `supabase/schema.sql` in the SQL editor when a project is linked.

## Brand

Always **Creative CV**. Founder: Samuel T. Parirenyatwa (2017). Contact:  info@creative-cv.co.za · +27 74 650 2580 · Mon–Thu 8–4, Fri 8–1.

# Sanaa Glam — Makeup Booking Web App

A modern appointment booking system for a makeup business operating in Germany. Built with Next.js 14, deployed on Vercel.

## Features

- **Multi-step booking wizard** — Service selection, location/zone, date/time, intake form
- **Zone-based travel pricing** — Transparent pricing for studio and 3 travel zones
- **Automated emails** — Booking confirmation, reminders (48h, 24h), follow-up
- **Admin dashboard** — Calendar view, appointment management, services CRUD
- **German legal compliance** — Impressum, Datenschutz, AGB, cancellation policy
- **Mobile-first design** — Beautiful UI with Sanaa Glam brand colors

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Email | Resend + React Email |
| Validation | Zod |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Supabase project (free tier)
- A Resend account (free tier)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sanaa-glam.git
   cd sanaa-glam
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Customer-facing pages (Home, Services, Booking, etc.)
│   ├── (admin)/admin/     # Protected admin dashboard
│   ├── api/               # API routes (booking, availability, cron)
│   └── layout.tsx         # Root layout with fonts
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── booking/           # Multi-step booking wizard (Phase 3)
│   ├── admin/             # Admin-specific components (Phase 5)
│   └── shared/            # Header, Footer
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── constants.ts       # Zones, enums, business info
│   ├── validators.ts      # Zod validation schemas
│   └── utils.ts           # Shared utilities
├── prisma/
│   └── schema.prisma      # Database schema
└── types/
    └── index.ts           # Shared TypeScript types
```

## Development Phases

- [x] **Phase 1** — Project foundation, schema, brand design, pages
- [ ] **Phase 2** — Database seeding, services API, dynamic pages
- [ ] **Phase 3** — Availability engine, booking wizard
- [ ] **Phase 4** — Email automation (confirmation, reminders, follow-up)
- [ ] **Phase 5** — Admin dashboard (auth, calendar, CRUD)
- [ ] **Phase 6** — Polish (portfolio gallery, SEO, mobile optimization)
- [ ] **Phase 7** — Testing, security, production deployment

## License

Private — All rights reserved.

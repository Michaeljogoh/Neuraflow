# Neuraflow

Neuraflow is a workflow automation web app in the spirit of [n8n](https://n8n.io): a visual graph editor where you connect **nodes** (triggers and actions), persist the graph to a database, and iterate toward full execution and integrations. This repository is an early-stage implementation focused on the **editor**, **persistence**, **authentication**, and **subscription** plumbing; **Executions** and **Credentials** screens exist as placeholders while the runtime matures.

## Features (current)

- **Visual workflow editor** built on **React Flow** (`@xyflow/react`): pan/zoom, snap-to-grid, minimap, and custom node types.
- **Node types** (see `prisma/schema.prisma` and `src/config/node-components.ts`): initial node, **manual trigger**, and **HTTP request** (UI and schema; execution wiring is still evolving).
- **Save workflow graph** to PostgreSQL via **tRPC** (nodes and edges replaced in a transaction).
- **Email and password authentication** with **Better Auth** and a **Prisma** adapter.
- **Subscriptions** via **Polar** (`@polar-sh/better-auth`): checkout and customer portal; creating workflows is gated behind an **active Polar subscription** (`premiumProcedure`).
- **Background jobs** scaffold with **Inngest** (includes a sample **Vercel AI SDK** + **Google Gemini** function for experimentation).
- **Observability** via **Sentry** for the Next.js app (see `next.config.ts` and Sentry example routes).

The app redirects `/` → `/workflows` (see `next.config.ts`).

## Tech stack

### Application and language

| Technology                                      | Role                                         |
| ----------------------------------------------- | -------------------------------------------- |
| [Next.js](https://nextjs.org/) 16               | Full-stack framework, App Router, API routes |
| [React](https://react.dev/) 19                  | UI                                           |
| [TypeScript](https://www.typescriptlang.org/) 5 | Typed application code                       |

### API and data fetching

| Technology                                            | Role                                      |
| ----------------------------------------------------- | ----------------------------------------- |
| [tRPC](https://trpc.io/) 11                           | End-to-end typesafe API (`src/trpc/`)     |
| [@tanstack/react-query](https://tanstack.com/query) 5 | Server-state cache for tRPC               |
| [superjson](https://github.com/blitz-js/superjson)    | tRPC data transformer (Dates, Maps, etc.) |

### Database

| Technology                                                                                                                         | Role                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [PostgreSQL](https://www.postgresql.org/)                                                                                          | Primary database                                               |
| [Prisma](https://www.prisma.io/) 7                                                                                                 | ORM, migrations, generated client under `src/generated/prisma` |
| [`pg`](https://node-postgres.com/)                                                                                                 | Node PostgreSQL driver                                         |
| [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#driver-adapters) | Prisma driver adapter for `pg`                                 |

### Auth and billing

| Technology                                                            | Role                                          |
| --------------------------------------------------------------------- | --------------------------------------------- |
| [Better Auth](https://www.better-auth.com/)                           | Sessions, email/password                      |
| [Polar](https://polar.sh/) (`@polar-sh/sdk`, `@polar-sh/better-auth`) | Billing, customer portal, subscription checks |

### Workflow UI and state

| Technology                              | Role                                                                |
| --------------------------------------- | ------------------------------------------------------------------- |
| [@xyflow/react](https://reactflow.dev/) | Workflow canvas (nodes, edges, controls)                            |
| [Jotai](https://jotai.org/)             | Editor instance / light client state (`src/features/editor/store/`) |
| [nuqs](https://nuqs.47ng.com/)          | URL search params state (Next.js adapter)                           |

### Forms, validation, and utilities

| Technology                                                                                                                                              | Role                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Zod](https://zod.dev/) 4                                                                                                                               | Input validation (e.g. tRPC inputs) |
| [React Hook Form](https://react-hook-form.com/) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers)                                   | Form state and Zod integration      |
| [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [class-variance-authority](https://cva.style/docs) | Conditional and variant styling     |
| [date-fns](https://date-fns.org/)                                                                                                                       | Date utilities                      |
| [@paralleldrive/cuid2](https://github.com/paralleldrive/cuid2), [random-word-slugs](https://www.npmjs.com/package/random-word-slugs)                    | IDs and default workflow names      |

### UI (shadcn-style + Radix)

The UI follows the [shadcn/ui](https://ui.shadcn.com/) pattern (**New York** style in `components.json`) on **Tailwind CSS v4**:

- **Styling**: Tailwind v4, `@tailwindcss/postcss`, `tw-animate-css`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Primitives**: extensive **Radix UI** packages (`@radix-ui/react-*`) for accessible components under `src/components/ui/`
- **Other UI libraries**: [cmdk](https://cmdk.paco.me/) (command palette), [Sonner](https://sonner.emilkowal.ski/) (toasts), [Recharts](https://recharts.org/) (charts), [vaul](https://vaul.emilko.com/) (drawer), [embla-carousel-react](https://www.embla-carousel.com/), [react-day-picker](https://react-day-picker.js.org/), [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels), [input-otp](https://input-otp.rodz.dev/), [next-themes](https://github.com/pacocoursey/next-themes)
- **Fonts**: [Geist](https://vercel.com/font) via `next/font/google`

### Background jobs and AI (scaffold)

| Technology                                                                                                                              | Role                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Inngest](https://www.inngest.com/)                                                                                                     | Durable workflows / steps (`src/inngest/`, `src/app/api/inngest/route.ts`) |
| [AI SDK](https://sdk.vercel.ai/docs) (`ai`) + [`@ai-sdk/google`](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) | LLM calls (e.g. Gemini in sample function)                                 |

### Observability and tooling

| Technology                                                                   | Role                                               |
| ---------------------------------------------------------------------------- | -------------------------------------------------- |
| [@sentry/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) | Error and performance monitoring                   |
| [Biome](https://biomejs.dev/)                                                | Lint and format (`npm run lint`, `npm run format`) |
| [tsx](https://github.com/privatenumber/tsx)                                  | TypeScript execution (dev dependency)              |
| [dotenv](https://github.com/motdotla/dotenv)                                 | Environment loading (e.g. Prisma config)           |

### React boundaries

- **`client-only`** / **`server-only`**: package boundaries for client vs server modules where used.

For a **line-by-line list of every npm package and version**, see [`package.json`](./package.json).

## Project layout (high level)

| Path                                                 | Purpose                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/app/`                                           | Next.js App Router pages, layouts, API routes (`api/auth`, `api/trpc`, `api/inngest`, etc.) |
| `src/features/editor/`                               | Workflow canvas and editor header (save, rename)                                            |
| `src/features/workflows/`                            | Workflow list, tRPC hooks, server routers                                                   |
| `src/features/auth/`                                 | Login and register UI                                                                       |
| `src/features/triggers/`, `src/features/executions/` | Node UIs for triggers and actions                                                           |
| `src/components/ui/`                                 | Shared UI primitives                                                                        |
| `src/trpc/`                                          | tRPC client, server context, routers                                                        |
| `src/lib/`                                           | Auth, DB, Polar client                                                                      |
| `prisma/`                                            | Schema and SQL migrations                                                                   |

## Getting started

### Prerequisites

- **Node.js** (LTS recommended) and npm
- **PostgreSQL** database

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root (values depend on your Polar app, database, and hosting). The codebase references at least:

| Variable             | Used for                                                             |
| -------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string (Prisma + `pg`)                         |
| `POLAR_ACCESS_TOKEN` | Polar API (`src/lib/polar.ts`; sandbox server is configured in code) |
| `POLAR_SUCCESS_URL`  | Redirect after checkout (`src/lib/auth.ts`)                          |

**Better Auth**, **Inngest**, **Google Generative AI** (for the AI SDK), and **Sentry** typically require additional variables following each product’s setup guides; configure those before using those features in production.

### Database

Apply migrations to your database:

```bash
npx prisma migrate dev
```

(Use `prisma migrate deploy` in CI/production.)

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (you will be redirected to `/workflows`).

### Scripts

| Command          | Description                |
| ---------------- | -------------------------- |
| `npm run dev`    | Next.js development server |
| `npm run build`  | Production build           |
| `npm run start`  | Start production server    |
| `npm run lint`   | Biome check                |
| `npm run format` | Biome format (write)       |

## Roadmap / gaps (honest)

- **Executions** and **Credentials** routes are stubs; a full n8n-like product would add a runtime engine, credential vault, execution history, and webhooks or schedule triggers here.
- **Inngest** currently ships a demo AI function rather than graph execution driven by saved workflows.

Contributions and issues are welcome as the project grows toward a fuller automation platform.

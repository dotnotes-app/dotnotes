# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev server: `npm run dev`
- Format code: `npm run format`
- Type check: `npm run test:compile`
- Database commands:
  - Generate migrations: `npm run db:generate`
  - Run migrations: `npm run db:migrate`
  - Push schema changes: `npm run db:push`

## Code Style
- Formatting: 85 char width, 4 spaces indent, ES5 trailing commas
- Components: React functional components with hooks
- Data fetching: TanStack React Query with dedicated query files
- Types: Strict TypeScript mode, clearly defined entity types
- Naming: PascalCase for components/types, camelCase for variables/functions
- Errors: Use try/catch in async functions, proper error propagation
- Database: Drizzle ORM with PostgreSQL (Neon serverless)
- Queries: Entity + Query naming convention (usersQuery, postQuery)
- Routing: TanStack React Router with definitive route structure
- Styling: Tailwind CSS

## Project Structure
- Components in `/src/components/`
- Routes in `/src/routes/`
- Database schema in `/src/db/schema.ts`
- Query functions in `/src/queries/`
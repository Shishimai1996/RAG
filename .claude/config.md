# Agent Config: Coding Standards & Guidelines

Guidance for any AI agent (Claude Code or otherwise) making changes in this repository. This supplements `CLAUDE.md` (architecture/commands reference) — read that first for how the system fits together.

## Project Structure

```
src/app/[locale]/     i18n-aware pages (Next.js App Router) — page.tsx (server), clientHome.tsx (client UI)
src/app/api/          Route handlers (e.g. api/ask/route.ts)
src/i18n/              next-intl routing/middleware config
src/contexts/          React context providers
lib/                   Server-side logic: LangChain chain setup, Qdrant retrieval/embedding, model setup, auth
components/             Shared pieces: markdown loading/splitting, UUID generation, small UI components
scripts/                 One-off/CLI entry points (e.g. embedMarkdown.ts)
data/                   Source Markdown knowledge base
messages/               en.json / ja.json translation strings
```

Keep new files in the directory that matches their role above rather than introducing new top-level folders. Server-only logic (API keys, DB/vector-store clients) belongs in `lib/`, not in `components/` or client components.

## Component Imports

- Use the `@/*` path alias (configured in `tsconfig.json`) for cross-directory imports instead of long relative chains (`../../../lib/...`). Relative imports are fine only for same-directory or one-level-up siblings.
- One default export per component file; named exports for hooks/utilities.
- Import only what's used — no wildcard imports, no unused imports (ESLint via `next/core-web-vitals` + `next/typescript` will flag these; treat warnings as things to fix, not ignore).
- Keep client (`"use client"`) and server modules clearly separated. Don't import server-only modules (anything touching `OPENAI_API_KEY`, Qdrant clients, `dotenv`) into a `"use client"` file.
- Prefer small, focused files (as already done: `retriever.ts`, `splitMarkdownByHeadings.ts`, `uuidGenerator.ts` are each single-purpose) over one large file mixing concerns.

## Functional Patterns (React & TypeScript)

- Function components only — no class components, no `React.Component`.
- Prefer function declarations for components (`export default function Home() {}`) and `const` arrow functions for helpers/hooks, matching current usage.
- State and side effects go through hooks (`useState`, `useEffect`, `useRef`, `useContext`). Don't introduce external state-management libraries without discussion — the app currently relies on local component state.
- Keep components declarative: derive UI from state rather than imperatively mutating the DOM.
- Async logic (API calls, streaming reads) stays in `async` functions/handlers, not chained `.then()`, matching the existing `async/await` style in `clientHome.tsx` and `lib/langchain.ts`.
- Favor composition (small components/functions combined) over inheritance or deep prop-drilling; use context (see `src/contexts/keycloakContext.tsx`) when state needs to cross many levels.

## RAG / Vector Search Patterns for New AI Features

Any new feature that touches retrieval, embeddings, or LLM calls should follow the existing pipeline shape rather than inventing a parallel one:

- **Embedding model access** goes through `lib/setupEmbedVector.ts`; **LLM access** goes through `lib/setupLlm.ts`. New features should reuse or extend these, not instantiate OpenAI clients ad hoc elsewhere.
- **Vector store access** goes through `lib/retrieveFromQdrant.ts` (querying) and `lib/embedDocuments.ts` (ingestion), both against the shared `my-docs` Qdrant collection. If a new feature needs a different corpus, give it its own clearly-named collection rather than mixing documents into `my-docs`.
- **Ingestion is idempotent by design**: documents get a deterministic UUID (`components/uuidGenerator.ts`) and `embedDocuments.ts` diffs against existing IDs before upserting. Any new ingestion path must preserve this — never blindly re-embed/duplicate the whole corpus on every run.
- **Chain construction** (prompt + retriever + LLM) follows the LangChain `createStuffDocumentsChain` / `createRetrievalChain` pattern used in `lib/langchain.ts`. New chains should be composed the same way rather than hand-rolling prompt concatenation.
- Keep retrieval parameters (e.g. `k`) and prompts colocated with the chain that uses them, as they are now, so behavior is easy to trace from a single file.
- Secrets/config (`OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`) are read via `process.env` in server-only modules (`lib/setupWoveyAccess.ts`, `lib/retrieveFromQdrant.ts`) — never hardcode keys or read them in client components.

## Production-Readiness & Type Safety

- `tsconfig.json` has `"strict": true` — new code must type-check cleanly under strict mode. Avoid `any`; prefer precise types or `unknown` with narrowing.
- Before considering a change done, it should pass `npx tsc --noEmit` and `npm run lint` (`next lint`) with no new errors.
- Handle the failure paths that already exist in the codebase's style: check `response.ok`/`response.body` before reading a stream, guard against missing env vars with a thrown `Error` (see `getOpenAIApiKey`), and return proper HTTP status codes from route handlers (see `api/ask/route.ts`'s 400/500 handling) — don't let errors fail silently.
- Don't leave commented-out/dead code paths as the shipped state (e.g. avoid patterns like the currently-disabled Keycloak wiring in `src/app/layout.tsx` for *new* work — that's legacy, not a pattern to repeat).
- No placeholder/mock data in code paths that ship — if something can't be completed, say so rather than stubbing it silently.

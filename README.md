# AI Product Engineering III — Day 4

Workflow patterns with [Anvia](https://www.npmjs.com/package/@anvia/core) `Pipeline`: chaining, routing, extraction, evaluator-optimizer, parallel fan-out, plan-and-execute, and observability.

## Setup

```bash
bun install
```

Create a `.env` file:

```
OPENAI_BASE_URL=...
OPENAI_API_KEY=...
```

## Run

```bash
bun src/examples/<file>.ts
bun run typecheck
```

## Examples (`src/examples/`)

| File | Pattern |
|---|---|
| `00-basic-pipeline.ts` | Clean input, then summarize |
| `01-copy-chain.ts` | Prompt chaining: draft → edit → translate |
| `02-support-router.ts` | Router: classify intent, reply with the matching prompt |
| `03-extract-company.ts` | Search, then `.extract` structured data (Tavily is stubbed) |
| `04-evaluator-optimizer.ts` | Draft → evaluate → revise |
| `05-parallel-review.ts` | `.parallel` specialists, then synthesize a verdict |
| `06-plan-and-execute.ts` | Plan steps, execute them with `Promise.all` |
| `07-assistant-decision.ts` | Decide an action, then act |
| `08-observer.ts` | `observer.onEvent` and `graph()` |

`helpers.ts` provides `ask()` and the stubbed `tavilyClient`. Shared model setup lives in `src/shared.ts`.

## Class notes

`src/01-prompt-chaining.ts`, `src/02-router.ts`, `src/03-parallel-fanout.ts` and `src/index.ts` are the live-coding versions written in class.

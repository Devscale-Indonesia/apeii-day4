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
bun src/<file>.ts
bun run typecheck
```

## Examples (`src/`)

| File | Pattern |
|---|---|
| `index.ts` | Pipeline basics: chained steps |
| `01-prompt-chaining.ts` | Prompt chaining |
| `02-router.ts` | Router: classify intent, then route |
| `03-parallel-fanout.ts` | `.parallel` branches, then combine |
| `00-basic-pipeline.ts` | Clean input, then summarize |
| `04-extract-company.ts` | Search, then `.extract` structured data (Tavily is stubbed) |
| `05-evaluator-optimizer.ts` | Draft → evaluate → revise |
| `06-plan-and-execute.ts` | Plan steps, execute them with `Promise.all` |
| `07-assistant-decision.ts` | Decide an action, then act |
| `08-observer.ts` | `observer.onEvent` and `graph()` |

`01`–`03` and `index.ts` are the versions taught in class and use `askAi` from `shared.ts`. The rest use `ask()` and the stubbed `tavilyClient` from `helpers.ts`.

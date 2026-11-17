# AI Product Engineering III — Day 4

Workflow patterns with [Anvia](https://www.npmjs.com/package/@anvia/core) `Pipeline`: chaining, routing, extraction, evaluator-optimizer, parallel fan-out, plan-and-execute, and observability.

Each file in `src/` is a small, runnable example and starts with an Indonesian comment block (APA / KENAPA / ALUR / CATATAN) explaining what it does and why.

## Why workflows?

A single big prompt is hard to debug and gives unpredictable results. A **workflow** breaks the job into small steps where code controls the flow and the LLM does one focused task per step. You get:

- **Reliability:** each step is simple, so each answer is better.
- **Debuggability:** you can see which step went wrong.
- **Control:** the code decides what happens next, not the model.

The patterns below are the building blocks. Real products combine them.

## Core ideas

- **`Pipeline`** is a list of steps. Each step gets the previous step's output as `input`.
- **`inputSchema`** (zod) validates the input before anything runs.
- **Structured output:** pass a zod schema to `askAiJson` and the model replies with typed JSON, not free text. This is what lets plain code (`if`, `switch`, `Promise.all`) make decisions from model output.
- **Step types used here:** `.step` (run any code), `.parallel` (run branches at once), `.extract` (turn text into a schema).

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

## Patterns

### Prompt chaining — `01-prompt-chaining.ts`, `00-basic-pipeline.ts`
Output of one step feeds the next.
**Why:** a big task ("research a company") is split into easy steps that are each checkable.
**Use when:** the task has clear sequential stages.
`generate-query → web-search → summarize`

### Routing — `02-router.ts`
The model classifies the input, then code sends it to the right path.
**Why:** different requests need different handling; specialized prompts beat one generic prompt.
**Use when:** inputs fall into distinct categories (technical, billing, general).
`classify intent → pick handler`

### Parallel fan-out — `03-parallel-fanout.ts`
Independent branches run at the same time, then results are combined.
**Why:** faster than running one after another, and each branch stays focused on one viewpoint.
**Use when:** subtasks do not depend on each other.
`product | engineering | business → summarize`

### Extraction — `04-extract-company.ts`
Turn messy text (search results) into a typed object with `.extract`.
**Why:** structured data can be stored, validated, and displayed; free text cannot.
**Tip:** `.describe()` on schema fields guides the model, and "return NONE if missing" stops it inventing facts.
`search → extract`

### Evaluator-optimizer — `05-evaluator-optimizer.ts`
One call writes, another judges, and a third revises only if needed.
**Why:** first drafts often miss the bar; a cheap review step raises quality without a human.
**Use when:** you have clear quality criteria.
`draft → evaluate → revise`

### Plan-and-execute — `06-plan-and-execute.ts`
The model plans first, then each planned step is carried out.
**Why:** separating thinking from doing keeps big goals on track. Unlike `.parallel`, the number of steps is decided by the model at runtime.
`plan → execute each step`

### Decision step — `07-assistant-decision.ts`
The model picks one action from a fixed list, and code runs it.
**Why:** a first step toward agents. The model chooses, but the allowed actions are limited, so behavior stays predictable and safe.
`decide (answer | search | handoff) → act`

### Observability — `08-observer.ts`
Watch each step as it runs with `observer.onEvent`, and inspect the pipeline shape with `graph()`.
**Why:** AI flows feel like black boxes; events show what ran, when, and where it failed.

## Files

| File | What it is |
|---|---|
| `index.ts` | Pipeline basics scratchpad from class |
| `01-prompt-chaining.ts` | Class example: chaining |
| `02-router.ts` | Class example: routing |
| `03-parallel-fanout.ts` | Class example: parallel |
| `00-basic-pipeline.ts` | Minimal two-step pipeline |
| `04-extract-company.ts` | Extraction (Tavily stubbed inline) |
| `05-evaluator-optimizer.ts` | Draft, evaluate, revise |
| `06-plan-and-execute.ts` | Plan, then execute |
| `07-assistant-decision.ts` | Decide, then act |
| `08-observer.ts` | Events and graph |
| `shared.ts` | Model setup plus `askAi` and `askAiJson` helpers |

`01`–`03` and `index.ts` are the versions taught in class. They contain TODO placeholders (web search, summarize, routing handlers) that are filled in live.

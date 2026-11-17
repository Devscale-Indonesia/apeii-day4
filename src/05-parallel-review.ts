import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask, model } from "./helpers";

const Idea = z.object({ idea: z.string() })
const Verdict = z.object({ go: z.enum(["build", "drop"]), reason: z.string() })
const specialist = (id: string, role: string) =>
  new Pipeline({ id, inputSchema: Idea })
    .step({ id: "review", run: ({ input }) => ask(role, input.idea) })

const ideaReview = new Pipeline({ id: "idea-review", inputSchema: Idea })
  .parallel({
    id: "specialists",
    branches: {
      product: specialist("product", "Find user value and gaps."),
      engineering: specialist("engineering", "Find implementation risks."),
      business: specialist("business", "Find go-to-market risks."),
    },
  })
  .extract({
    id: "synthesize",
    model,
    instructions: "Give one recommendation.",
    outputSchema: Verdict,
    text: ({ input }) => JSON.stringify(input),
  })

console.log((await ideaReview.run({ input: { idea: "An AI app that plans your meals from fridge photos" } })).output)

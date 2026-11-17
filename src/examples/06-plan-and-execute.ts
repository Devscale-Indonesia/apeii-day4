import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask, generateCompletion, model } from "./helpers";

const Goal = z.object({ goal: z.string() })
const Plan = z.object({ steps: z.array(z.string()) })

const planAndExecute = new Pipeline({ id: "plan-execute", inputSchema: Goal })
  .step({
    id: "plan",
    run: async ({ input }) => {
      const plan = await generateCompletion({
        instructions: "Break the goal into 3 steps.",
        prompt: input.goal,
        model,
        outputSchema: Plan,
      })
      return plan.output.steps
    },
  })
  .step({
    id: "execute",
    run: ({ input: steps }) =>
      Promise.all(steps.map((step) => ask("Do this step in two bullets.", step))),
  })

console.log((await planAndExecute.run({ input: { goal: "Launch a newsletter" } })).output)

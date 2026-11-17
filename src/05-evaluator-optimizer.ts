import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask, generateCompletion, model } from "./helpers";

const Request = z.object({ request: z.string() })
const Evaluation = z.object({ passed: z.boolean(), feedback: z.string() })
const replyWithReview = new Pipeline({ id: "reply-review", inputSchema: Request })
  .step({
    id: "draft",
    run: ({ input }) => ask("Write a concise, empathetic reply.", input.request),
  })
  .step({
    id: "evaluate",
    run: async ({ input: reply }) => {
      const result = await generateCompletion({
        instructions: "Is it concise and empathetic?",
        prompt: reply,
        model,
        outputSchema: Evaluation,
      })
      return { reply, ...result.output }
    },
  })
  .step({
    id: "revise",
    run: ({ input }) =>
      input.passed ? input.reply : ask("Revise: " + input.feedback, input.reply),
  })

console.log((await replyWithReview.run({ input: { request: "Customer's order arrived broken" } })).output)

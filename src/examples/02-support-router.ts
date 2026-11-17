import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask, generateCompletion, model } from "./helpers";

const PROMPTS = {
  technical: "You are a support engineer. Give debugging steps.",
  billing: "You are a billing specialist. Ask for account details.",
}
const Intent = z.object({ intent: z.enum(["technical", "billing"]) })
const Message = z.object({ message: z.string() })

const router = new Pipeline({ id: "support-router", inputSchema: Message })
  .step({
    id: "classify",
    run: async ({ input }) => {
      const result = await generateCompletion({
        instructions: "Classify the intent.",
        prompt: input.message,
        model,
        outputSchema: Intent,
      })
      return { message: input.message, intent: result.output.intent }
    },
  })
  .step({
    id: "reply",
    run: ({ input }) => ask(PROMPTS[input.intent], input.message),
  })

console.log((await router.run({ input: { message: "My invoice is wrong" } })).output)

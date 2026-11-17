import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask, generateCompletion, model } from "./helpers";

const Input = z.object({ userInput: z.string() })
const Decision = z.object({ action: z.enum(["answer", "search", "handoff"]) })

const assistant = new Pipeline({ id: "assistant", inputSchema: Input })
  .step({
    id: "decide",
    run: async ({ input }) => {
      const result = await generateCompletion({
        instructions: "Decide the next action.",
        prompt: input.userInput,
        model,
        outputSchema: Decision,
      })
      return { userInput: input.userInput, action: result.output.action }
    },
  })
  .step({
    id: "act",
    run: async ({ input }) => {
      if (input.action === "search") return "search the web, then answer"
      if (input.action === "handoff") return "create a task for the team"
      return ask("Answer briefly.", input.userInput)
    },
  })

console.log((await assistant.run({ input: { userInput: "What's the weather in Jakarta?" } })).output)

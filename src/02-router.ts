import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAiJson } from "./shared";

const inputSchema = z.object({
  userPrompt: z.string(),
});

const routingPipeline = new Pipeline({
  id: "routing-pipeline",
  inputSchema,
})
  .step({
    id: "intention-extraction",
    run: async ({ input }) => {
      const intention = await askAiJson(
        `User prompt: ${input.userPrompt}`,
        z.object({
          intent: z.enum(["technical", "billing", "general"]),
        }),
      );

      return {
        output: intention.output,
        userInput: input.userPrompt,
      };
    },
  })
  .step({
    id: "routing",
    run: ({ input }) => {
      console.log(input);
    },
  });

const userPrompts = [
  "Why my dishwasher does not work, it looks there is something wrong",
  "Why i got charged twice??",
  // "When is the office hour?",
];

userPrompts.forEach(async (up) => {
  await routingPipeline.run({ input: { userPrompt: up } });
});

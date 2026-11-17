import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask } from "./helpers";

const summarize = new Pipeline({
  id: "summarize",
  inputSchema: z.object({ text: z.string().min(1) }),
})
  .step({ id: "clean", run: ({ input }) => input.text.trim() })
  .step({
    id: "summarize",
    run: ({ input }) => ask("Summarize in one sentence.", input),
  })

const { output } = await summarize.run({
  input: { text: "  Anvia is a TypeScript runtime for AI agents.  " },
})
console.log(output)

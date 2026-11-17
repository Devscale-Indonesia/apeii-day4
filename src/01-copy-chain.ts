import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask } from "./helpers";

const Topic = z.object({ topic: z.string() })

const copyChain = new Pipeline({ id: "copy-chain", inputSchema: Topic })
  .step({
    id: "draft",
    run: ({ input }) => ask("Write product copy.", "Two sentences about " + input.topic),
  })
  .step({
    id: "edit",
    run: ({ input }) => ask("Tighten the copy.", "One sentence: " + input),
  })
  .step({
    id: "translate",
    run: ({ input }) => ask("Translate to Indonesian.", input),
  })

console.log((await copyChain.run({ input: { topic: "a standing desk" } })).output)

import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";

const pipelineInputSchema = z.object({
  idea: z.string().min(1),
});

const myPipeline = new Pipeline({
  id: "my-pipeline",
  inputSchema: pipelineInputSchema,
})
  .step({
    id: "convert-uppercase",
    run: (ctx) => {
      return {
        iniOutput: ctx.input.idea.toUpperCase(),
      };
    },
  })
  .step({
    id: "convert-lowercase",
    run: (ctx) => {
      return ctx.input.iniOutput.toLowerCase();
    },
  });

// deepresearch -> domain-company.com
// crawling
// summary | extract
// enrichment - financial stage
// ...
// ...
// ...
// ...

// private -> public

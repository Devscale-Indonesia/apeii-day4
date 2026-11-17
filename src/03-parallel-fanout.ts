import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAi } from "./shared";

const inputSchema = z.string().min(20);

const ideaReview = new Pipeline({
  id: "idea-review",
  inputSchema,
})
  .parallel({
    id: "pov-review",
    branches: {
      product: new Pipeline({
        id: "product-pov",
        inputSchema: z.string(),
      }).step({
        id: "generate-pov",
        run: async ({ input }) => {
          return await askAi(
            `Give your perspective from product view of this idea: ${input}`,
          );
        },
      }),
      engineering: new Pipeline({
        id: "engineering-pov",
        inputSchema: z.string(),
      }).step({
        id: "generate-pov",
        run: async ({ input }) => {
          return await askAi(
            `Give your perspective from engineering view of this idea: ${input}`,
          );
        },
      }),
      business: new Pipeline({
        id: "business-pov",
        inputSchema: z.string(),
      }).step({
        id: "generate-pov",
        run: async ({ input }) => {
          return await askAi(
            `Give your perspective from business view of this idea: ${input}`,
          );
        },
      }),
    },
  })
  .step({
    id: "summarize",
    run: async ({ input }) => {
      const summary = await askAi(
        `Summarize these POV: ${JSON.stringify(input)}`,
      );
      console.log(summary.text);
    },
  });

await ideaReview.run({ input: "bikin aplikasi tinder buat kucing" });

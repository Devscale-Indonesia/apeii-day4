import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { tavilyClient, model } from "./helpers";

const CompanySchema = z.object({
  name: z.string().describe("Legal company name"),
  slogan: z.string().describe("Company slogan"),
  address: z.string().describe("Company address"),
  stockTicker: z.string().describe("Stock ticker"),
})
const Query = z.object({ company: z.string() })

const companyInfo = new Pipeline({ id: "company-info", inputSchema: Query })
  .step({ id: "search", run: ({ input }) => tavilyClient.search(input.company) })
  .extract({
    id: "extract",
    model,
    outputSchema: CompanySchema,
    instructions: "Extract the key information. If missing, return NONE.",
    text: ({ input }) => JSON.stringify(input.results),
  })

console.log((await companyInfo.run({ input: { company: "Apple" } })).output)

/**
 * APA: Mengubah teks mentah (hasil pencarian web) jadi data terstruktur dengan `.extract`.
 * KENAPA: Hasil search berupa teks berantakan. Dengan schema zod, kita dapat object rapi
 *         (name, slogan, address, stockTicker) yang bisa disimpan ke database atau ditampilkan.
 * ALUR: nama perusahaan -> search (Tavily, di sini di-stub) -> extract (AI isi schema dari teks)
 * CATATAN: `.describe()` di tiap field adalah petunjuk untuk AI. Instruksi "return NONE"
 *          mencegah AI mengarang data yang tidak ada di sumber.
 */
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

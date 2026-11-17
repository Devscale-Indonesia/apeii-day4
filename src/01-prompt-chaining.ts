/**
 * APA: Prompt chaining. Hasil satu langkah jadi bahan untuk langkah berikutnya.
 * KENAPA: Tugas besar ("riset perusahaan") sulit dijawab dengan satu prompt. Dipecah jadi
 *         langkah kecil, hasil tiap langkah lebih akurat dan bisa kita cek satu per satu.
 * ALUR: nama perusahaan -> generate-query (AI buat query pencarian)
 *                       -> web-search (cari di web, masih TODO)
 *                       -> summarize (ringkas hasil, masih TODO)
 * CATATAN: `askAiJson` + schema zod membuat AI membalas JSON terstruktur (bukan teks bebas),
 *          sehingga step berikutnya bisa langsung memakai `queries` tanpa parsing manual.
 */
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAiJson } from "./shared";

const CompanyInputSchema = z.object({
  companyName: z.string().min(1),
});

const researchPipeline = new Pipeline({
  id: "research-pipeline",
  inputSchema: CompanyInputSchema,
})
  .step({
    id: "generate-query",
    run: async ({ input }) => {
      const queries = await askAiJson(
        `Generate web search query for ${input.companyName}`,
        z.object({
          queries: z.array(z.string()),
        }),
        "Generate queries for researching about investment and financial stage of company",
      );

      return queries.output;
    },
  })
  .step({
    id: "web-search",
    run: ({ input }) => {
      // search web with tavily
      console.log(input);
    },
  })
  .step({
    id: "summarize",
    run: ({ input }) => {
      // summarize with the LLM
      console.log(input);
    },
  });

const result = await researchPipeline.run({
  input: { companyName: "Gojek Indonesia" },
});

console.log(result.output);

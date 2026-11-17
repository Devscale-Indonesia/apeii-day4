/**
 * APA: Pipeline paling dasar di Anvia: dua step yang jalan berurutan.
 * KENAPA: Pipeline memecah pekerjaan jadi langkah kecil yang jelas. Tiap step menerima
 *         output step sebelumnya sebagai `input`, jadi mudah dibaca, dites, dan di-debug.
 * ALUR: input { text } -> clean (trim spasi, tanpa AI) -> summarize (ringkas 1 kalimat dengan AI)
 * CATATAN: `inputSchema` (zod) memvalidasi input di awal. Kalau text kosong, pipeline langsung error.
 */
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAi } from "./shared";

const summarize = new Pipeline({
  id: "summarize",
  inputSchema: z.object({ text: z.string().min(1) }),
})
  .step({ id: "clean", run: ({ input }) => input.text.trim() })
  .step({
    id: "summarize",
    run: async ({ input }) =>
      (await askAi(`Summarize in one sentence: ${input}`)).text,
  })

const { output } = await summarize.run({
  input: { text: "  Anvia is a TypeScript runtime for AI agents.  " },
})
console.log(output)

/**
 * APA: Observability. Memantau setiap step pipeline saat berjalan dan melihat bentuk grafnya.
 * KENAPA: Pipeline AI sering terasa seperti kotak hitam. Dengan observer, kita tahu step mana
 *         yang jalan, kapan, dan di mana gagal. Sangat membantu saat debugging dan monitoring.
 * ALUR: sama seperti 00-basic-pipeline, ditambah `observer.onEvent` yang dipanggil tiap ada event.
 * CATATAN: `summarize.graph()` mengembalikan struktur node pipeline tanpa menjalankannya,
 *          berguna untuk visualisasi atau dokumentasi.
 */
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

const result = await summarize.run({
  input: { text: "  Anvia is a TypeScript runtime for AI agents.  " },
  observer: {
    onEvent: (event) => console.log(event.type, event.node.id),
  },
})

console.log(result.output)
console.log(summarize.graph().nodes.map((node) => node.id))

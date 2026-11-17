/**
 * APA: Evaluator-optimizer. AI menulis, lalu AI (sebagai penilai) memeriksa, lalu direvisi bila perlu.
 * KENAPA: Draf pertama LLM sering belum sesuai kriteria. Satu langkah evaluasi murah membuat
 *         kualitas naik tanpa campur tangan manusia.
 * ALUR: request -> draft (tulis balasan) -> evaluate ({ passed, feedback }) -> revise
 *       (kalau passed, balasan dipakai apa adanya; kalau tidak, direvisi memakai feedback)
 * CATATAN: Evaluasi dibuat terstruktur (boolean + feedback) supaya keputusan "revisi atau tidak"
 *          ditentukan kode, bukan ditebak dari teks.
 */
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAi, askAiJson } from "./shared";

const Request = z.object({ request: z.string() })
const Evaluation = z.object({ passed: z.boolean(), feedback: z.string() })
const replyWithReview = new Pipeline({ id: "reply-review", inputSchema: Request })
  .step({
    id: "draft",
    run: async ({ input }) =>
      (await askAi(`Write a concise, empathetic reply to: ${input.request}`)).text,
  })
  .step({
    id: "evaluate",
    run: async ({ input: reply }) => {
      const result = await askAiJson(
        reply,
        Evaluation,
        "Is it concise and empathetic?",
      )
      return { reply, ...Evaluation.parse(result.output) }
    },
  })
  .step({
    id: "revise",
    run: async ({ input }) =>
      input.passed
        ? input.reply
        : (await askAi(`Revise using this feedback: ${input.feedback}\n\nReply: ${input.reply}`)).text,
  })

console.log((await replyWithReview.run({ input: { request: "Customer's order arrived broken" } })).output)

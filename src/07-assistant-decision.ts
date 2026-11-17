/**
 * APA: Asisten sederhana yang memutuskan sendiri tindakan berikutnya: jawab, cari, atau serahkan ke tim.
 * KENAPA: Ini langkah awal menuju agent: AI menentukan alur, tapi kita tetap memegang kendali
 *         lewat daftar aksi yang terbatas (enum), jadi perilakunya bisa diprediksi dan aman.
 * ALUR: userInput -> decide (AI pilih: answer | search | handoff) -> act (kode menjalankan aksinya)
 * CATATAN: Aksi search dan handoff di sini masih placeholder. Di produksi, isi dengan
 *          pemanggilan tool atau pembuatan task sungguhan.
 */
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAi, askAiJson } from "./shared";

const Input = z.object({ userInput: z.string() })
const Decision = z.object({ action: z.enum(["answer", "search", "handoff"]) })

const assistant = new Pipeline({ id: "assistant", inputSchema: Input })
  .step({
    id: "decide",
    run: async ({ input }) => {
      const result = await askAiJson(
        input.userInput,
        Decision,
        "Decide the next action.",
      )
      return { userInput: input.userInput, action: Decision.parse(result.output).action }
    },
  })
  .step({
    id: "act",
    run: async ({ input }) => {
      if (input.action === "search") return "search the web, then answer"
      if (input.action === "handoff") return "create a task for the team"
      return (await askAi(`Answer briefly: ${input.userInput}`)).text
    },
  })

console.log((await assistant.run({ input: { userInput: "What's the weather in Jakarta?" } })).output)

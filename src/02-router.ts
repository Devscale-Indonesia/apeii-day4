/**
 * APA: Routing. AI mengenali maksud (intent) user, lalu pesan diarahkan ke jalur yang sesuai.
 * KENAPA: Tiap jenis pertanyaan butuh penanganan beda (teknis, tagihan, umum). Dengan router,
 *         tiap jalur bisa punya prompt khusus yang lebih tepat daripada satu prompt untuk semua.
 * ALUR: userPrompt -> intention-extraction (AI pilih: technical | billing | general)
 *                  -> routing (di sini baru console.log; nanti diganti handler per intent)
 * CATATAN: `z.enum([...])` memaksa AI memilih salah satu nilai yang valid, jadi hasilnya
 *          bisa dipakai langsung untuk if/switch.
 */
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { askAiJson } from "./shared";

const inputSchema = z.object({
  userPrompt: z.string(),
});

const routingPipeline = new Pipeline({
  id: "routing-pipeline",
  inputSchema,
})
  .step({
    id: "intention-extraction",
    run: async ({ input }) => {
      const intention = await askAiJson(
        `User prompt: ${input.userPrompt}`,
        z.object({
          intent: z.enum(["technical", "billing", "general"]),
        }),
      );

      return {
        output: intention.output,
        userInput: input.userPrompt,
      };
    },
  })
  .step({
    id: "routing",
    run: ({ input }) => {
      console.log(input);
    },
  });

const userPrompts = [
  "Why my dishwasher does not work, it looks there is something wrong",
  "Why i got charged twice??",
  // "When is the office hour?",
];

userPrompts.forEach(async (up) => {
  await routingPipeline.run({ input: { userPrompt: up } });
});

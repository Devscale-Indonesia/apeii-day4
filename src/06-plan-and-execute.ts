/**
 * APA: Plan-and-execute. AI membuat rencana dulu, lalu setiap langkah rencana dieksekusi.
 * KENAPA: Untuk tujuan yang luas, memisahkan "berpikir" (plan) dari "mengerjakan" (execute)
 *         membuat hasil lebih terarah, dan langkah-langkahnya bisa dikerjakan paralel.
 * ALUR: goal -> plan (AI pecah jadi 3 langkah, array string) -> execute (tiap langkah dikerjakan AI)
 * CATATAN: `Promise.all` menjalankan semua langkah bersamaan. Jumlah langkah ditentukan
 *          AI saat runtime, sesuatu yang tidak bisa dilakukan `.parallel` dengan cabang tetap.
 */
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { ask, generateCompletion, model } from "./helpers";

const Goal = z.object({ goal: z.string() })
const Plan = z.object({ steps: z.array(z.string()) })

const planAndExecute = new Pipeline({ id: "plan-execute", inputSchema: Goal })
  .step({
    id: "plan",
    run: async ({ input }) => {
      const plan = await generateCompletion({
        instructions: "Break the goal into 3 steps.",
        prompt: input.goal,
        model,
        outputSchema: Plan,
      })
      return plan.output.steps
    },
  })
  .step({
    id: "execute",
    run: ({ input: steps }) =>
      Promise.all(steps.map((step) => ask("Do this step in two bullets.", step))),
  })

console.log((await planAndExecute.run({ input: { goal: "Launch a newsletter" } })).output)

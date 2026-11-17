import { generateCompletion } from "@anvia/core";
import { model } from "../shared";

export { generateCompletion, model };

export async function ask(instructions: string, prompt: string) {
  const result = await generateCompletion({ instructions, prompt, model });
  return result.text;
}

// Stub so the extract example runs without a Tavily key. Swap for the real client.
export const tavilyClient = {
  async search(company: string) {
    return {
      results: [
        {
          content: `${company} is a company. Slogan: "Think different". HQ: Cupertino, CA. Ticker: AAPL.`,
        },
      ],
    };
  },
};

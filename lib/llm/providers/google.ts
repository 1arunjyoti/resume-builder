import { GoogleGenAI } from "@google/genai";
import type { LLMGenerateInput, LLMProvider } from "@/lib/llm/types";

const DEFAULT_MODEL = "gemini-3-flash-preview";

function buildPrompt(input: LLMGenerateInput): string {
  if (input.system) {
    return `${input.system}\n\n${input.prompt}`;
  }
  return input.prompt;
}

async function requestGoogleGenerate(
  apiKey: string,
  input: LLMGenerateInput,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: buildPrompt(input),
    config: {
      temperature: input.temperature ?? 0.5,
      maxOutputTokens: input.maxTokens ?? 512,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Google LLM returned an empty response.");
  }

  return text;
}

export const googleProvider: LLMProvider = {
  id: "google",
  label: "Google (Gemini)",
  status: "ready",
  requiresApiKey: true,
  async validateKey(apiKey: string) {
    if (!apiKey) return false;
    try {
      const result = await requestGoogleGenerate(apiKey, {
        prompt: "Respond with the word OK.",
        temperature: 0,
        maxTokens: 4,
      });
      return result.toLowerCase().includes("ok");
    } catch (err) {
      throw err;
    }
  },
  async generateText(apiKey: string, input: LLMGenerateInput) {
    if (!apiKey) {
      throw new Error("Missing Google API key.");
    }
    return requestGoogleGenerate(apiKey, input);
  },
};

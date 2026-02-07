import type { LLMProvider, LLMProviderId } from "@/lib/llm/types";
import { googleProvider } from "@/lib/llm/providers/google";
import { localProvider } from "@/lib/llm/providers/local";

const createStubProvider = (
  id: LLMProviderId,
  label: string,
): LLMProvider => ({
  id,
  label,
  status: "coming-soon",
  requiresApiKey: true,
  async validateKey() {
    throw new Error(`${label} provider is not implemented yet.`);
  },
  async generateText() {
    throw new Error(`${label} provider is not implemented yet.`);
  },
});

export const LLM_PROVIDERS: LLMProvider[] = [
  googleProvider,
  createStubProvider("openai", "OpenAI"),
  createStubProvider("anthropic", "Anthropic"),
  localProvider,
];

export const getProvider = (id: LLMProviderId): LLMProvider | undefined =>
  LLM_PROVIDERS.find((provider) => provider.id === id);

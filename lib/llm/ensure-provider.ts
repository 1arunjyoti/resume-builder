import { getProvider } from "@/lib/llm/providers";
import type { LLMProvider, LLMProviderId } from "@/lib/llm/types";

interface EnsureProviderSuccess {
  provider: LLMProvider;
  apiKey: string;
}

interface EnsureProviderError {
  error: string;
}

export type EnsureProviderResult = EnsureProviderSuccess | EnsureProviderError;

/**
 * Validates that an LLM provider is available and properly configured.
 * Handles the API key check correctly: local models (lmstudio, ollama, openai-compatible)
 * do not require an API key, while cloud providers (Google, OpenAI, Anthropic) do.
 *
 * HuggingFace (accessed via the "local" provider with localApiType="huggingface") does
 * require a key, but that's enforced inside the local provider's generateText.
 */
export function ensureLLMProvider(opts: {
  providerId: LLMProviderId;
  apiKeys: Record<LLMProviderId, string>;
  consent: { generation: boolean; rewriting: boolean; analysis: boolean };
  /** Which consent gate to check. Pass null to skip consent check. */
  requiredConsent: "generation" | "rewriting" | "analysis" | null;
}): EnsureProviderResult {
  const { providerId, apiKeys, consent, requiredConsent } = opts;

  if (requiredConsent) {
    if (!consent[requiredConsent]) {
      const labels: Record<string, string> = {
        generation: "content generation",
        rewriting: "rewriting",
        analysis: "analysis",
      };
      return { error: `Enable ${labels[requiredConsent]} consent to use this feature.` };
    }
  }

  const provider = getProvider(providerId);
  if (!provider || provider.status !== "ready") {
    return { error: "Selected provider is not available yet." };
  }

  const apiKey = apiKeys[providerId]?.trim() ?? "";

  // Only require an API key if the provider needs one
  if (provider.requiresApiKey && !apiKey) {
    return { error: `Missing API key for ${provider.label}. Configure it in Settings.` };
  }

  return { provider, apiKey };
}

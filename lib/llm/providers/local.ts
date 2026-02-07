import type { LLMGenerateInput, LLMProvider } from "@/lib/llm/types";
import { useLLMSettingsStore } from "@/store/useLLMSettingsStore";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
};

type OllamaResponse = {
  response?: string;
  error?: string;
};

type HuggingFaceResponse =
  | { generated_text?: string }
  | Array<{ generated_text?: string }>
  | { error?: string };

/**
 * Build OpenAI-compatible chat completions URL
 * Uses OpenAI's standard endpoint: /v1/chat/completions
 */
function buildOpenAIUrl(endpoint: string) {
  return `${endpoint.replace(/\/$/, "")}/v1/chat/completions`;
}

/**
 * Build LM Studio chat completions URL
 * LM Studio supports multiple endpoint types:
 * - OpenAI-compatible: /v1/chat/completions (used here - most common)
 * - Native API: /api/v1/chat
 * - Anthropic-compatible: /v1/messages
 * We use the OpenAI-compatible endpoint for maximum compatibility
 */
function buildLMStudioUrl(endpoint: string) {
  return `${endpoint.replace(/\/$/, "")}/v1/chat/completions`;
}

/**
 * Build Ollama API URL
 * Uses Ollama's native endpoint: /api/generate
 */
function buildOllamaUrl(endpoint: string) {
  return `${endpoint.replace(/\/$/, "")}/api/generate`;
}

function buildHuggingFaceUrl(endpoint: string, model: string) {
  if (endpoint.includes("/models/")) {
    return endpoint;
  }
  return `${endpoint.replace(/\/$/, "")}/models/${model}`;
}

async function requestLocalGenerate(
  apiKey: string,
  input: LLMGenerateInput,
): Promise<string> {
  const { localEndpoint, localModel, localApiType } =
    useLLMSettingsStore.getState();
  if (!localEndpoint) {
    throw new Error("Local endpoint is not configured.");
  }
  if (!localModel) {
    throw new Error("Local model is not configured.");
  }

  if (localApiType === "ollama") {
    const url = buildOllamaUrl(localEndpoint);
    const prompt = input.system
      ? `${input.system}\n\n${input.prompt}`
      : input.prompt;
    const body = {
      model: localModel,
      prompt,
      stream: false,
      options: {
        temperature: input.temperature ?? 0.5,
        num_predict: input.maxTokens ?? 512,
      },
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as OllamaResponse;
    if (!response.ok) {
      const message = data.error || "Ollama request failed.";
      throw new Error(`Local model error (${response.status}): ${message}`);
    }
    const text = data.response?.trim();
    if (!text) {
      throw new Error("Local model returned an empty response.");
    }
    return text;
  }

  if (localApiType === "lmstudio" || localApiType === "openai") {
    // Both LM Studio and OpenAI use the same endpoint structure
    // LM Studio: http://localhost:1234/v1/chat/completions (OpenAI-compatible)
    // OpenAI-compatible APIs: <endpoint>/v1/chat/completions
    const url = localApiType === "lmstudio" 
      ? buildLMStudioUrl(localEndpoint)
      : buildOpenAIUrl(localEndpoint);
    
    const messages = [
      input.system ? { role: "system", content: input.system } : null,
      { role: "user", content: input.prompt },
    ].filter(Boolean);
    
    const body = {
      model: localModel,
      messages,
      temperature: input.temperature ?? 0.5,
      max_tokens: input.maxTokens ?? 512,
    };
    
    console.log(`[LLM] Sending request to ${url}`, {
      model: localModel,
      messageCount: messages.length,
    });
    
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    console.log(`[LLM] Response status: ${response.status}`);
    
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))); 
      const message = data.error?.message || `Request failed with status ${response.status}`;
      throw new Error(`Local model error (${response.status}): ${message}`);
    }
    
    const data = (await response.json()) as ChatCompletionResponse;
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("Local model returned an empty response.");
    }
    return text;
  }

  if (localApiType === "huggingface") {
    if (!apiKey) {
      throw new Error("Hugging Face API key is required.");
    }
    const url = buildHuggingFaceUrl(localEndpoint, localModel);
    const body = {
      inputs: input.system
        ? `${input.system}\n\n${input.prompt}`
        : input.prompt,
      parameters: {
        temperature: input.temperature ?? 0.5,
        max_new_tokens: input.maxTokens ?? 512,
      },
      options: { wait_for_model: true },
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as HuggingFaceResponse;
    if (!response.ok) {
      const message =
        "error" in data && data.error
          ? data.error
          : "Hugging Face request failed.";
      throw new Error(`Local model error (${response.status}): ${message}`);
    }
    const text =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "generated_text" in data
          ? data.generated_text
          : undefined;
    if (!text) {
      throw new Error("Local model returned an empty response.");
    }
    return text.trim();
  }

  throw new Error(`Unsupported local API type: ${localApiType}`);
}

export const localProvider: LLMProvider = {
  id: "local",
  label: "Local Model",
  status: "ready",
  requiresApiKey: false,
  async validateKey() {
    try {
      await requestLocalGenerate("", {
        prompt: "Respond with the word OK.",
        temperature: 0,
        maxTokens: 4,
      });
      return true;
    } catch {
      return false;
    }
  },
  async generateText(apiKey: string, input: LLMGenerateInput) {
    return requestLocalGenerate(apiKey, input);
  },
};

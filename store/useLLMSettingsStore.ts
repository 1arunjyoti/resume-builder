import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { db } from "@/db";
import type {
  LLMProviderId,
  LLMSettings,
  LLMTone,
  LocalApiType,
} from "@/lib/llm/types";

const STORAGE_KEY = "llm-settings";

const DEFAULT_SETTINGS: LLMSettings = {
  providerId: "google",
  apiKeys: {
    google: "",
    openai: "",
    anthropic: "",
    local: "",
  },
  sessionOnly: false,
  consent: {
    generation: false,
    analysis: false,
    rewriting: false,
  },
  redaction: {
    stripContactInfo: true,
  },
  tone: "neutral",
  localEndpoint: "http://localhost:1234",
  localModel: "google/gemma-3-4b",
  localApiType: "lmstudio",
};

interface LLMSettingsState extends LLMSettings {
  setProviderId: (providerId: LLMProviderId) => void;
  setApiKey: (providerId: LLMProviderId, apiKey: string) => void;
  clearApiKey: (providerId: LLMProviderId) => void;
  setSessionOnly: (sessionOnly: boolean) => void;
  setConsent: (key: keyof LLMSettings["consent"], value: boolean) => void;
  setRedaction: (key: keyof LLMSettings["redaction"], value: boolean) => void;
  setTone: (tone: LLMTone) => void;
  setLocalEndpoint: (endpoint: string) => void;
  setLocalModel: (model: string) => void;
  setLocalApiType: (apiType: LocalApiType) => void;
  resetSettings: () => void;
}

const storage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    const record = await db.settings.get(name);
    return record?.value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await db.settings.put({ id: name, value });
  },
  removeItem: async (name: string) => {
    await db.settings.delete(name);
  },
}));

export const useLLMSettingsStore = create<LLMSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setProviderId: (providerId) => set({ providerId }),
      setApiKey: (providerId, apiKey) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [providerId]: apiKey,
          },
        })),
      clearApiKey: (providerId) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [providerId]: "",
          },
        })),
      setSessionOnly: (sessionOnly) => set({ sessionOnly }),
      setConsent: (key, value) =>
        set((state) => ({
          consent: {
            ...state.consent,
            [key]: value,
          },
        })),
      setRedaction: (key, value) =>
        set((state) => ({
          redaction: {
            ...state.redaction,
            [key]: value,
          },
        })),
      setTone: (tone) => set({ tone }),
      setLocalEndpoint: (endpoint) => set({ localEndpoint: endpoint }),
      setLocalModel: (model) => set({ localModel: model }),
      setLocalApiType: (apiType) => set({ localApiType: apiType }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: STORAGE_KEY,
      storage,
      partialize: (state) => ({
        providerId: state.providerId,
        apiKeys: state.sessionOnly ? DEFAULT_SETTINGS.apiKeys : state.apiKeys,
        sessionOnly: state.sessionOnly,
        consent: state.consent,
        redaction: state.redaction,
        tone: state.tone,
        localEndpoint: state.localEndpoint,
        localModel: state.localModel,
        localApiType: state.localApiType,
      }),
    }
  )
);
